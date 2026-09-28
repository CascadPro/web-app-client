export type RealtimeStatus =
	| "idle"
	| "connecting"
	| "authorizing"
	| "online"
	| "reconnecting"
	| "offline"
	| "error"

export type ConnectionQuality = "unknown" | "good" | "degraded" | "poor"

export interface RealtimeStore extends RealtimeStoreActions {
	status: RealtimeStatus

	metrics: ConnectionMetrics

	reconnectAttempt: number

	lastError: string | null
	lastConnectedAt: number | null
	lastDisconnectedAt: number | null
}

export interface ConnectionMetrics {
	quality: ConnectionQuality
	rtt: number | null
	jitter: number | null
	missedPongs: number
}

interface RealtimeStoreActions {
	setStatus: (status: RealtimeStatus) => void

	setError: (error: string) => void

	setReconnectAttempt: (attempt: number) => void

	setConnected: () => void

	setDisconnected: () => void

	setMetrics: (metrics: ConnectionMetrics) => void

	resetMetrics: () => void

	reset: () => void
}
