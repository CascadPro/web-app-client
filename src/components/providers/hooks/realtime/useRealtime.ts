"use client"

import { useCallback, useMemo } from "react"

import { useLogout } from "@/libs/hooks"
import { queryClient } from "@/libs/query/client"
import { QueryKeys } from "@/libs/query/keys"
import { WebSocketClient } from "@/libs/realtime"
import {
	subscribeToPresence,
	subscribeToSessions
} from "@/libs/realtime/subscriptions"

export function useRealtime() {
	const logout = useLogout()

	const invalidateSessions = useCallback(() => {
		void queryClient.invalidateQueries({
			queryKey: QueryKeys.sessions.all
		})
	}, [])

	const onAuthenticated = useCallback(() => {
		invalidateSessions()
	}, [invalidateSessions])

	const onReconnect = useCallback(() => {
		invalidateSessions()
	}, [invalidateSessions])

	const subscribe = useCallback(
		(client: WebSocketClient) => {
			const unsubscribePresence = subscribeToPresence(client)
			const unsubscribeSessions = subscribeToSessions(client, logout)

			return () => {
				unsubscribePresence()
				unsubscribeSessions()
			}
		},
		[logout]
	)

	return useMemo(
		() => ({
			subscribe,
			onAuthenticated,
			onReconnect,
			invalidateSessions
		}),
		[subscribe, onAuthenticated, onReconnect, invalidateSessions]
	)
}
