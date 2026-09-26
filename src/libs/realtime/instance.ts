import { useAuthStore } from "@/store/auth"
import { useRealtimeStore } from "@/store/realtime"

import { WebSocketClient } from "./client"

export const realtimeClient = new WebSocketClient({
	url: process.env.NEXT_PUBLIC_WS_URL!,

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

	onReconnecting: attempt => {
		useRealtimeStore.getState().setReconnectAttempt(attempt)
		useRealtimeStore.getState().setStatus("reconnecting")
	},

	onReconnected: () => {
		useRealtimeStore.getState().setConnected()
	},

	onDisconnected: () => {
		useRealtimeStore.getState().setDisconnected()
	},

	onError: () => {
		useRealtimeStore.getState().setStatus("error")
	}
})
