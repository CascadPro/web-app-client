export const WS_AUTH_EVENTS = {
	AUTH_REQUEST: "auth.request",
	AUTH_SUCCESS: "auth.success",
	AUTH_ERROR: "auth.error"
} as const

export const WS_EVENTS = {
	PRESENCE_ONLINE: "presence.online",
	PRESENCE_OFFLINE: "presence.offline",

	SESSION_CREATED: "session.created",
	SESSION_UPDATED: "session.updated",
	SESSION_REVOKED: "session.revoked",
	SESSION_REVOKED_ALL: "session.revoked.all"
} as const

export type WsAuthEventType =
	(typeof WS_AUTH_EVENTS)[keyof typeof WS_AUTH_EVENTS]

export type WsEventType = (typeof WS_EVENTS)[keyof typeof WS_EVENTS]
