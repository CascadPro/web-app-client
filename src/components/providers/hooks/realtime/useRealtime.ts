"use client"

import { useCallback, useRef } from "react"

import { useLogout } from "@/libs/hooks"
import { queryClient } from "@/libs/query/client"
import { QueryKeys } from "@/libs/query/keys"
import { WebSocketClient } from "@/libs/realtime"
import {
	subscribeToPresence,
	subscribeToSessions,
	subscribeToSettings
} from "@/libs/realtime/subscriptions"

export function useRealtime() {
	const logoutRef = useRef<(() => void) | null>(null)

	const invalidateSessions = useCallback(() => {
		void queryClient.invalidateQueries({
			queryKey: QueryKeys.sessions.all
		})
	}, [])

	const subscribe = useCallback((client: WebSocketClient) => {
		const unsubscribePresence = subscribeToPresence(client)

		const unsubscribeSessions = subscribeToSessions(client, logoutRef.current!)

		const unsubscribeSettings = subscribeToSettings(client)

		return () => {
			unsubscribePresence()
			unsubscribeSessions()
			unsubscribeSettings()
		}
	}, [])

	const logout = useLogout()
	logoutRef.current = logout

	return {
		subscribe,
		invalidateSessions
	}
}
