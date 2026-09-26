import { queryClient } from "@/libs/query/client"
import type { WebSocketClient } from "@/libs/realtime"
import { WS_EVENTS } from "@/libs/realtime/events"
import {
	handlePresenceOffline,
	handlePresenceOnline
} from "@/libs/realtime/handlers"

export function subscribeToPresence(client: WebSocketClient): () => void {
	const unsubscribeOnline = client.on(WS_EVENTS.PRESENCE_ONLINE, event => {
		handlePresenceOnline(queryClient, event.data.sid)
	})

	const unsubscribeOffline = client.on(WS_EVENTS.PRESENCE_OFFLINE, event => {
		handlePresenceOffline(queryClient, event.data.sid)
	})

	return () => {
		unsubscribeOnline()
		unsubscribeOffline()
	}
}
