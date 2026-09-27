import { WS_EVENTS } from "./events"
import type { WsServerEvent } from "./types"

const WS_EVENT_TYPES = new Set<string>(Object.values(WS_EVENTS))

export function isWsServerEvent(message: unknown): message is WsServerEvent {
	if (typeof message !== "object" || message === null) {
		return false
	}

	const event = message as Record<string, unknown>

	return typeof event.type === "string" && WS_EVENT_TYPES.has(event.type)
}
