import type { WsAuthError, WsAuthMessage, WsEvent, WsMessage } from "./types"

type EventHandler<T = unknown> = (event: WsEvent<T>) => void

interface WebSocketClientOptions {
	url: string
	getAccessToken: () => string | null
	onAuthenticated?: () => void
	onDisconnected?: () => void
	onReconnect?: () => void
}

const INITIAL_RECONNECT_DELAY = 1000
const MAX_RECONNECT_DELAY = 30_000

export class WebSocketClient {
	private socket: WebSocket | null = null
	private reconnectTimer: ReturnType<typeof setTimeout> | null = null

	private reconnectAttempt = 0
	private manuallyClosed = false
	private authenticated = false

	private readonly handlers = new Map<string, Set<EventHandler>>()

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

		this.manuallyClosed = false
		this.clearReconnectTimer()

		const accessToken = this.options.getAccessToken()

		if (!accessToken) {
			return
		}

		this.authenticated = false

		const socket = new WebSocket(this.options.url)

		this.socket = socket

		socket.addEventListener("open", () => {
			this.sendAuth(accessToken)
		})

		socket.addEventListener("message", event => {
			this.handleMessage(event.data)
		})

		socket.addEventListener("close", () => {
			this.handleClose()
		})

		socket.addEventListener("error", () => {
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
			return
		}

		socket.close()
	}

	reconnect(): void {
		this.disconnect()

		this.manuallyClosed = false
		this.reconnectAttempt = 0

		this.connect()
	}

	isConnected(): boolean {
		return this.socket?.readyState === WebSocket.OPEN && this.authenticated
	}

	on<T = unknown>(eventType: string, handler: EventHandler<T>): () => void {
		let handlers = this.handlers.get(eventType)

		if (!handlers) {
			handlers = new Set()
			this.handlers.set(eventType, handlers)
		}

		handlers.add(handler as EventHandler)

		return () => {
			handlers?.delete(handler as EventHandler)

			if (handlers?.size === 0) {
				this.handlers.delete(eventType)
			}
		}
	}

	private sendAuth(accessToken: string): void {
		if (!this.socket) {
			return
		}

		const body: WsAuthMessage = {
			type: "auth.request",
			token: accessToken
		}

		this.socket.send(JSON.stringify(body))
	}

	private handleMessage(rawMessage: string): void {
		let message: WsMessage

		try {
			message = JSON.parse(rawMessage) as WsMessage
		} catch {
			return
		}

		if (message.type === "auth.success") {
			this.handleAuthenticated()
			return
		}

		if (message.type === "auth.error") {
			this.handleAuthError(message as WsAuthError)
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
		console.error(
			"WebSocket authentication failed:",
			message.data.code,
			message.data.message
		)

		this.authenticated = false
		this.manuallyClosed = true

		this.socket?.close()
	}

	private handleClose(): void {
		const wasAuthenticated = this.authenticated

		this.authenticated = false
		this.socket = null

		this.options.onDisconnected?.()

		if (this.manuallyClosed) {
			return
		}

		if (wasAuthenticated) {
			this.reconnectAttempt = 0
		}

		this.scheduleReconnect()
	}

	private scheduleReconnect(): void {
		if (this.manuallyClosed) {
			return
		}

		if (!this.options.getAccessToken()) {
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

	private emit<T>(event: WsEvent<T>): void {
		const handlers = this.handlers.get(event.type)

		if (!handlers) {
			return
		}

		for (const handler of handlers) {
			handler(event)
		}
	}
}
