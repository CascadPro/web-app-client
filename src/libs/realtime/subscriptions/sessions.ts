import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"

import { AppRoutes } from "@/libs/constants"
import { queryClient } from "@/libs/query/client"
import type { WebSocketClient } from "@/libs/realtime"
import { WS_EVENTS } from "@/libs/realtime/events"
import {
	handleSessionCreated,
	handleSessionRevoked,
	handleSessionRevokedAll,
	handleSessionUpdated
} from "@/libs/realtime/handlers"
import { useAuthStore } from "@/store/auth"

export function subscribeToSessions(
	client: WebSocketClient,
	router: AppRouterInstance
): () => void {
	const unsubscribeCreated = client.on(WS_EVENTS.SESSION_CREATED, event => {
		handleSessionCreated(queryClient, event)
	})

	const unsubscribeUpdated = client.on(WS_EVENTS.SESSION_UPDATED, event => {
		handleSessionUpdated(queryClient, event)
	})

	const unsubscribeRevoked = client.on(WS_EVENTS.SESSION_REVOKED, event => {
		const isCurrentSession = handleSessionRevoked(queryClient, event)

		if (!isCurrentSession) {
			return
		}

		logout(router)
	})

	const unsubscribeRevokedAll = client.on(
		WS_EVENTS.SESSION_REVOKED_ALL,
		event => {
			const isCurrentSession = handleSessionRevokedAll(queryClient, event)

			if (!isCurrentSession) {
				return
			}

			logout(router)
		}
	)

	return () => {
		unsubscribeCreated()
		unsubscribeUpdated()
		unsubscribeRevoked()
		unsubscribeRevokedAll()
	}
}

function logout(router: AppRouterInstance): void {
	useAuthStore.getState().setUnauthenticated()

	router.replace(AppRoutes.LOGIN)
}
