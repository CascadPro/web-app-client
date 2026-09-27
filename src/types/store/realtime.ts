export type RealtimeStatus =
	| "idle"
	| "connecting"
	| "authorizing"
	| "online"
	| "reconnecting"
	| "offline"
	| "error"

export interface RealtimeStore extends RealtimeStoreActions {
	status: RealtimeStatus

	reconnectAttempt: number

	lastError: string | null
	lastConnectedAt: number | null
	lastDisconnectedAt: number | null
}

interface RealtimeStoreActions {
	setStatus: (status: RealtimeStatus) => void

	setError: (error: string) => void

	setReconnectAttempt: (attempt: number) => void

	setConnected: () => void

	setDisconnected: () => void

	reset: () => void
}
