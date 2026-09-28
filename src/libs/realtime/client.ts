import { v4 as uuidv4 } from "uuid"

import type { ConnectionMetrics, ConnectionQuality } from "@/types/store"

import { WS_AUTH_EVENTS, WS_HEARTBEAT_EVENTS, type WsEventType } from "./events"
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

	onMetrics?: (metrics: ConnectionMetrics) => void
}

const INITIAL_RECONNECT_DELAY = 1000
const MAX_RECONNECT_DELAY = 30_000

const HEARTBEAT_INTERVAL = 15_000
const HEARTBEAT_TIMEOUT = 10_000
const MAX_RTT_SAMPLES = 10

const DEGRADED_RTT = 80
const POOR_RTT = 200

const MAX_MISSED_PONGS = 3

export class WebSocketClient {
	private socket: WebSocket | null = null
	private reconnectTimer: ReturnType<typeof setTimeout> | null = null

	private reconnectAttempt = 0
	private manuallyClosed = false
	private authenticated = false

	private readonly pendingPings = new Map<string, number>()
	private readonly rttSamples: number[] = []

	private heartbeatTimer: ReturnType<typeof setInterval> | null = null
	private missedPongs = 0
	private smoothedRtt: number | null = null

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

		this.stopHeartbeat()

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

	private sendMessage<T = unknown>(eventType: WsEventType, data?: T): void {
		if (this.socket?.readyState !== WebSocket.OPEN) {
			return
		}

		const body: WsEvent = {
			id: uuidv4(),
			type: eventType,
			data
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

			case WS_HEARTBEAT_EVENTS.PONG:
				this.handleHeartbeatPong(message as WsEvent<undefined>)
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

		this.startHeartbeat()

		this.options.onAuthenticated?.()
	}

	private handleAuthError(message: WsAuthError): void {
		this.authenticated = false
		this.manuallyClosed = true

		const socket = this.socket

		this.socket = null

		socket?.close()
	}

	private handleHeartbeatPong(message: WsEvent<undefined>): void {
		const sentAt = this.pendingPings.get(message.id)

		if (sentAt === undefined) {
			return
		}

		this.pendingPings.delete(message.id)

		const rtt = performance.now() - sentAt

		this.missedPongs = 0

		this.rttSamples.push(rtt)

		if (this.rttSamples.length > MAX_RTT_SAMPLES) {
			this.rttSamples.shift()
		}

		this.smoothedRtt =
			this.smoothedRtt === null ? rtt : this.smoothedRtt * 0.8 + rtt * 0.2

		this.updateConnectionQuality()
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

		this.stopHeartbeat()

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

	private startHeartbeat(): void {
		this.stopHeartbeat()

		this.pendingPings.clear()
		this.missedPongs = 0

		this.heartbeatTimer = setInterval(() => {
			this.sendHeartbeat()
		}, HEARTBEAT_INTERVAL)

		this.sendHeartbeat()
	}

	private stopHeartbeat(): void {
		if (this.heartbeatTimer) {
			clearInterval(this.heartbeatTimer)
			this.heartbeatTimer = null
		}

		this.pendingPings.clear()
	}

	private sendHeartbeat(): void {
		if (!this.isAuthenticated()) return

		if (this.pendingPings.size > 0) {
			const [id, sentAt] = this.pendingPings.entries().next().value!

			if (performance.now() - sentAt < HEARTBEAT_TIMEOUT) {
				return
			}

			this.pendingPings.delete(id)
			this.missedPongs++

			this.updateConnectionQuality()

			if (this.missedPongs >= MAX_MISSED_PONGS) {
				this.socket?.close()
			}

			return
		}

		const id = uuidv4()
		const now = performance.now()

		this.pendingPings.set(id, now)

		this.socket?.send(
			JSON.stringify({
				id,
				type: WS_HEARTBEAT_EVENTS.PING
			} as Partial<WsEvent>)
		)
	}

	private updateConnectionQuality(): void {
		const rtt = this.smoothedRtt

		let quality: ConnectionQuality

		if (this.missedPongs >= MAX_MISSED_PONGS) {
			quality = "poor"
		} else if (rtt === null) {
			quality = "unknown"
		} else if (rtt >= POOR_RTT) {
			quality = "poor"
		} else if (rtt >= DEGRADED_RTT) {
			quality = "degraded"
		} else {
			quality = "good"
		}

		const samples = this.rttSamples

		const jitter =
			samples.length > 1
				? samples
						.slice(1)
						.reduce(
							(sum, value, index) => sum + Math.abs(value - samples[index]),
							0
						) /
					(samples.length - 1)
				: null

		this.options.onMetrics?.({
			quality,
			rtt: this.smoothedRtt,
			jitter,
			missedPongs: this.missedPongs
		})
	}
}
