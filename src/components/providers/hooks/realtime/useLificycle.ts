"use client"

import { useEffect, useRef } from "react"

import { WebSocketClient } from "@/libs/realtime"
import { useAuthStore } from "@/store/auth"

import { useRealtime } from "./useRealtime"

const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:8000/ws"

export function useRealtimeLifecycle(): void {
	const clientRef = useRef<WebSocketClient | null>(null)

	const status = useAuthStore(state => state.status)
	const accessToken = useAuthStore(state => state.accessToken)

	const setupRealtime = useRealtime()
	const setupRealtimeRef = useRef(setupRealtime)

	setupRealtimeRef.current = setupRealtime

	useEffect(() => {
		if (status !== "authenticated" || !accessToken) {
			clientRef.current?.disconnect()
			clientRef.current = null
			return
		}

		const client = new WebSocketClient({
			url: WS_URL,

			getAccessToken: () => useAuthStore.getState().accessToken,

			onAuthenticated: () => {
				setupRealtimeRef.current.onAuthenticated()
			},

			onReconnect: () => {
				setupRealtimeRef.current.onReconnect()
			}
		})

		clientRef.current = client

		const unsubscribe = setupRealtimeRef.current.subscribe(client)

		client.connect()

		const handleOnline = () => {
			if (!client.isAuthenticated() && !client.isConnecting()) {
				client.connect()
			}

			setupRealtimeRef.current.invalidateSessions()
		}

		const handleVisibilityChange = () => {
			if (document.visibilityState !== "visible") {
				return
			}

			if (!client.isAuthenticated() && !client.isConnecting()) {
				client.connect()
			}

			setupRealtimeRef.current.invalidateSessions()
		}

		window.addEventListener("online", handleOnline)
		document.addEventListener("visibilitychange", handleVisibilityChange)

		return () => {
			unsubscribe()

			window.removeEventListener("online", handleOnline)
			document.removeEventListener("visibilitychange", handleVisibilityChange)

			client.disconnect()

			if (clientRef.current === client) {
				clientRef.current = null
			}
		}
	}, [status, accessToken])
}
