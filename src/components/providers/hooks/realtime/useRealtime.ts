"use client"

import { useRouter } from "next/navigation"
import { useCallback, useMemo } from "react"

import { queryClient } from "@/libs/query/client"
import { QueryKeys } from "@/libs/query/keys"
import { WebSocketClient } from "@/libs/realtime"
import {
	subscribeToPresence,
	subscribeToSessions
} from "@/libs/realtime/subscriptions"

export function useRealtime() {
	const router = useRouter()

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
			const unsubscribeSessions = subscribeToSessions(client, router)

			return () => {
				unsubscribePresence()
				unsubscribeSessions()
			}
		},
		[router]
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
