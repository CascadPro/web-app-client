import { create } from "zustand"

import type { RealtimeStore } from "@/types/store"

export const useRealtimeStore = create<RealtimeStore>(set => ({
	status: "idle",

	lastError: null,

	reconnectAttempt: 0,

	lastConnectedAt: null,
	lastDisconnectedAt: null,

	metrics: {
		quality: "unknown",
		rtt: null,
		jitter: null,
		missedPongs: 0
	},

	setStatus: status =>
		set({
			status,
			lastError: null
		}),

	setError: error =>
		set({
			status: "error",
			lastError: error
		}),

	setReconnectAttempt: reconnectAttempt =>
		set({
			reconnectAttempt
		}),

	setConnected: () =>
		set({
			status: "online",
			lastError: null,
			reconnectAttempt: 0,
			lastConnectedAt: Date.now()
		}),

	setDisconnected: () =>
		set({
			status: "offline",
			lastDisconnectedAt: Date.now()
		}),

	setMetrics: metrics => set({ metrics }),

	resetMetrics: () =>
		set({
			metrics: {
				quality: "unknown",
				rtt: null,
				jitter: null,
				missedPongs: 0
			}
		}),

	reset: () =>
		set({
			status: "idle",
			lastError: null,
			reconnectAttempt: 0,
			lastConnectedAt: null,
			lastDisconnectedAt: null
		})
}))
