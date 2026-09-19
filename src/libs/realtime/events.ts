export const WS_EVENTS = {
	AUTH_SUCCESS: "auth.success",
	AUTH_ERROR: "auth.error",
	AUTH_REQUEST: "auth.request",

	PRESENCE_ONLINE: "presence.online",
	PRESENCE_OFFLINE: "presence.offline",

	SESSION_CREATED: "session.created",
	SESSION_UPDATED: "session.updated",
	SESSION_REVOKED: "session.revoked"
} as const

export type WsEventType = (typeof WS_EVENTS)[keyof typeof WS_EVENTS]
