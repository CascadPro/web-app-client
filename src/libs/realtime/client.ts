import { randomUUID } from "node:crypto"

import {
	WS_AUTH_EVENTS,
	type WsAuthEventType,
	type WsEventType
} from "./events"
import type {
	WsAuthError,
	WsAuthMessage,
	WsEvent,
	WsEventHandler,
	WsServerEvent
} from "./types"
import { isWsServerEvent } from "./utils"

interface WebSocketClientOptions {
	url: string
	getAccessToken: () => string | null

	onConnecting?: () => void
	onAuthorizing?: () => void

	onAuthenticated?: () => void

	onReconnecting?: (attempt: number) => void
	onReconnect?: () => void

	onDisconnected?: () => void
	onError?: (error: Event) => void
}

const INITIAL_RECONNECT_DELAY = 1000
const MAX_RECONNECT_DELAY = 30_000

export class WebSocketClient {
	private socket: WebSocket | null = null
	private reconnectTimer: ReturnType<typeof setTimeout> | null = null

	private reconnectAttempt = 0
	private manuallyClosed = false
	private authenticated = false

	private readonly handlers = new Map<
		WsEventType,
		Set<(event: WsServerEvent) => void>
	>()

	private readonly options: WebSocketClientOptions

	constructor(options: WebSocketClientOptions) {
		this.options = options
	}

	connect(): void {
		if (typeof window === "undefined") {
			return
		}

		if (
			this.socket?.readyState === WebSocket.OPEN ||
			this.socket?.readyState === WebSocket.CONNECTING
		) {
			return
		}

		const accessToken = this.options.getAccessToken()

		if (!accessToken) {
			this.options.onDisconnected?.()
			return
		}

		this.manuallyClosed = false
		this.clearReconnectTimer()
		this.authenticated = false

		this.options.onConnecting?.()

		const socket = new WebSocket(this.options.url)

		this.socket = socket

		socket.addEventListener("open", () => {
			if (this.socket !== socket) {
				return
			}

			this.options.onAuthorizing?.()

			this.sendAuth(accessToken)
		})

		socket.addEventListener("message", event => {
			if (this.socket !== socket) {
				return
			}

			this.handleMessage(event.data)
		})

		socket.addEventListener("close", () => {
			if (this.socket !== socket) {
				return
			}

			this.socket = null

			this.handleClose()
		})

		socket.addEventListener("error", event => {
			if (this.socket !== socket) {
				return
			}

			this.options.onError?.(event)

			socket.close()
		})
	}

	disconnect(): void {
		this.manuallyClosed = true
		this.authenticated = false

		this.clearReconnectTimer()

		const socket = this.socket

		this.socket = null

		if (!socket) {
			this.options.onDisconnected?.()
			return
		}

		socket.close()

		this.options.onDisconnected?.()
	}

	reconnect(): void {
		this.disconnect()

		this.manuallyClosed = false
		this.reconnectAttempt = 0

		this.connect()
	}

	isOpen(): boolean {
		return this.socket?.readyState === WebSocket.OPEN
	}

	isConnecting(): boolean {
		return this.socket?.readyState === WebSocket.CONNECTING
	}

	isAuthenticated(): boolean {
		return this.isOpen() && this.authenticated
	}

	isConnected(): boolean {
		return this.isAuthenticated()
	}

	on<T extends WsEventType>(
		eventType: T,
		handler: WsEventHandler<T>
	): () => void {
		let handlers = this.handlers.get(eventType)

		if (!handlers) {
			handlers = new Set<(event: WsServerEvent) => void>()

			this.handlers.set(eventType, handlers)
		}

		const typedHandler = handler as (event: WsServerEvent) => void

		handlers.add(typedHandler)

		return () => {
			const currentHandlers = this.handlers.get(eventType)

			if (!currentHandlers) {
				return
			}

			currentHandlers.delete(typedHandler)

			if (currentHandlers.size === 0) {
				this.handlers.delete(eventType)
			}
		}
	}

	private sendAuth(accessToken: string): void {
		if (this.socket?.readyState !== WebSocket.OPEN) {
			return
		}

		const body: WsAuthMessage = {
			type: WS_AUTH_EVENTS.AUTH_REQUEST,
			token: accessToken
		}

		this.socket.send(JSON.stringify(body))
	}

	private sendMessage<T = unknown>(eventType: WsAuthEventType, data: T): void {
		if (this.socket?.readyState !== WebSocket.OPEN) {
			return
		}

		const body: WsEvent = {
			id: randomUUID(),
			type: eventType,
			data,
			timestamp: new Date().toISOString()
		}

		this.socket.send(JSON.stringify(body))
	}

	private handleMessage(rawMessage: string): void {
		let message: unknown

		try {
			message = JSON.parse(rawMessage)
		} catch {
			return
		}

		if (
			typeof message !== "object" ||
			message === null ||
			!("type" in message) ||
			typeof message.type !== "string"
		) {
			return
		}

		switch (message.type) {
			case WS_AUTH_EVENTS.AUTH_SUCCESS:
				this.handleAuthenticated()
				return

			case WS_AUTH_EVENTS.AUTH_ERROR:
				this.handleAuthError(message as WsAuthError)
				return

			default:
				break
		}

		if (!isWsServerEvent(message)) {
			return
		}

		this.emit(message)
	}

	private handleAuthenticated(): void {
		const wasReconnect = this.reconnectAttempt > 0

		this.authenticated = true
		this.reconnectAttempt = 0

		if (wasReconnect) {
			this.options.onReconnect?.()
		}

		this.options.onAuthenticated?.()
	}

	private handleAuthError(message: WsAuthError): void {
		this.authenticated = false
		this.manuallyClosed = true

		const socket = this.socket

		this.socket = null

		socket?.close()
	}

	private handleClose(): void {
		this.authenticated = false

		if (this.manuallyClosed) {
			this.options.onDisconnected?.()
			return
		}

		if (!this.options.getAccessToken()) {
			this.options.onDisconnected?.()
			return
		}

		this.scheduleReconnect()
	}

	private scheduleReconnect(): void {
		if (this.manuallyClosed) {
			return
		}

		if (!this.options.getAccessToken()) {
			this.options.onDisconnected?.()
			return
		}

		if (
			this.socket?.readyState === WebSocket.OPEN ||
			this.socket?.readyState === WebSocket.CONNECTING
		) {
			return
		}

		this.clearReconnectTimer()

		const exponentialDelay = Math.min(
			INITIAL_RECONNECT_DELAY * 2 ** this.reconnectAttempt,
			MAX_RECONNECT_DELAY
		)

		const jitter = Math.random() * 500
		const delay = exponentialDelay + jitter

		this.reconnectAttempt += 1

		this.options.onReconnecting?.(this.reconnectAttempt)

		this.reconnectTimer = setTimeout(() => {
			this.connect()
		}, delay)
	}

	private clearReconnectTimer(): void {
		if (!this.reconnectTimer) {
			return
		}

		clearTimeout(this.reconnectTimer)

		this.reconnectTimer = null
	}

	private emit(event: WsServerEvent): void {
		const handlers = this.handlers.get(event.type)

		if (!handlers) {
			return
		}

		for (const handler of handlers) {
			handler(event)
		}
	}
}
