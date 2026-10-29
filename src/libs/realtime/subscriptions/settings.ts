import { queryClient } from "@/libs/query/client"
import type { WebSocketClient } from "@/libs/realtime"
import { WS_EVENTS } from "@/libs/realtime/events"
import { handleSettingsUpdated } from "@/libs/realtime/handlers/settings"

export function subscribeToSettings(client: WebSocketClient): () => void {
	return client.on(WS_EVENTS.SETTINGS_UPDATED, event => {
		handleSettingsUpdated(queryClient, event)
	})
}
