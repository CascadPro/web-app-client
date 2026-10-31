import { queryClient } from "@/libs/query/client"
import type { WebSocketClient } from "@/libs/realtime"
import { WS_EVENTS } from "@/libs/realtime/events"
import { handleUsersUpdate } from "@/libs/realtime/handlers/users"

export function subscribeToUser(client: WebSocketClient): () => void {
	const unsubscribeUsersUpdated = client.on(WS_EVENTS.USER_UPDATED, event => {
		handleUsersUpdate(queryClient, event)
	})

	const unsubscribeUsersAvatarUpdated = client.on(
		WS_EVENTS.USER_AVATAR_UPDATED,
		event => {
			handleUsersUpdate(queryClient, event)
		}
	)

	return () => {
		unsubscribeUsersUpdated()
		unsubscribeUsersAvatarUpdated()
	}
}
