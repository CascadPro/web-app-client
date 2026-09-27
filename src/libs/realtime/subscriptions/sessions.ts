import { queryClient } from "@/libs/query/client"
import type { WebSocketClient } from "@/libs/realtime"
import { WS_EVENTS } from "@/libs/realtime/events"
import {
	handleSessionCreated,
	handleSessionRevoked,
	handleSessionRevokedAll,
	handleSessionUpdated
} from "@/libs/realtime/handlers"

export function subscribeToSessions(
	client: WebSocketClient,
	logout: () => void
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

		logout()
	})

	const unsubscribeRevokedAll = client.on(
		WS_EVENTS.SESSION_REVOKED_ALL,
		event => {
			const isCurrentSession = handleSessionRevokedAll(queryClient, event)

			if (isCurrentSession) {
				return
			}

			logout()
		}
	)

	return () => {
		unsubscribeCreated()
		unsubscribeUpdated()
		unsubscribeRevoked()
		unsubscribeRevokedAll()
	}
}
