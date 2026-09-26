"use client"

import { useEffect, useRef } from "react"

import { realtimeClient } from "@/libs/realtime"
import { useAuthStore } from "@/store/auth"

import { useRealtime } from "./useRealtime"

export function useRealtimeLifecycle(): void {
	const status = useAuthStore(state => state.status)
	const accessToken = useAuthStore(state => state.accessToken)

	const setupRealtime = useRealtime()
	const setupRealtimeRef = useRef(setupRealtime)

	setupRealtimeRef.current = setupRealtime

	useEffect(() => {
		if (status !== "authenticated" || !accessToken) {
			realtimeClient.disconnect()

			return
		}

		const unsubscribe = setupRealtimeRef.current.subscribe(realtimeClient)

		realtimeClient.connect()

		const handleOnline = () => {
			if (!realtimeClient.isAuthenticated() && !realtimeClient.isConnecting()) {
				realtimeClient.connect()
			}

			setupRealtimeRef.current.invalidateSessions()
		}

		const handleVisibilityChange = () => {
			if (document.visibilityState !== "visible") {
				return
			}

			if (!realtimeClient.isAuthenticated() && !realtimeClient.isConnecting()) {
				realtimeClient.connect()
			}

			setupRealtimeRef.current.invalidateSessions()
		}

		window.addEventListener("online", handleOnline)

		document.addEventListener("visibilitychange", handleVisibilityChange)

		return () => {
			unsubscribe()

			window.removeEventListener("online", handleOnline)

			document.removeEventListener("visibilitychange", handleVisibilityChange)

			realtimeClient.disconnect()
		}
	}, [status, accessToken])
}
