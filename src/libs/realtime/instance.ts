import { useAuthStore } from "@/store/auth"
import { useRealtimeStore } from "@/store/realtime"

import { WebSocketClient } from "./client"

const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:8000/ws"

export const realtimeClient = new WebSocketClient({
	url: WS_URL,

	getAccessToken: () => {
		return useAuthStore.getState().accessToken
	},

	onConnecting: () => {
		useRealtimeStore.getState().setStatus("connecting")
	},

	onAuthorizing: () => {
		useRealtimeStore.getState().setStatus("authorizing")
	},

	onAuthenticated: () => {
		useRealtimeStore.getState().setConnected()
	},

	onReconnect: () => {
		useRealtimeStore.getState().setConnected()
	},

	onReconnecting: attempt => {
		useRealtimeStore.getState().setReconnectAttempt(attempt)
		useRealtimeStore.getState().setStatus("reconnecting")
	},

	onDisconnected: () => {
		useRealtimeStore.getState().setDisconnected()
	},

	onError: () => {
		useRealtimeStore.getState().setError("WebSocket connection error")
	}
})
