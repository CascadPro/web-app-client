import { z } from "zod"

const SESSION_ID_REGEX = /^[a-f0-9]{24}$/
const AVATAR_FILE_ID_REGEX = /^[a-f0-9]{48}$/

export const wsAuthSuccessScheme = z.object({
	type: z.literal("auth.success"),
	message: z.string()
})

export const wsAuthErrorScheme = z.object({
	type: z.literal("auth.error"),
	code: z.string(),
	message: z.string(),
	timestamp: z.iso.datetime()
})

export const presenceOnlineEventScheme = z.object({
	id: z.uuid(),
	type: z.literal("presence.online"),
	data: z.object({
		sid: z.string().regex(SESSION_ID_REGEX),
		uid: z.uuid()
	}),
	timestamp: z.iso.datetime().optional()
})

export const presenceOfflineEventScheme = z.object({
	id: z.uuid(),
	type: z.literal("presence.offline"),
	data: z.object({
		sid: z.string().regex(SESSION_ID_REGEX),
		uid: z.uuid()
	}),
	timestamp: z.iso.datetime().optional()
})

export const sessionCreatedEventScheme = z.object({
	id: z.uuid(),
	type: z.literal("session.created"),
	data: z.object({
		session: z.any()
	}),
	timestamp: z.iso.datetime().optional()
})

export const sessionUpdatedEventScheme = z.object({
	id: z.uuid(),
	type: z.literal("session.updated"),
	data: z.object({
		session: z.any()
	}),
	timestamp: z.iso.datetime().optional()
})

export const sessionRevokedEventScheme = z.object({
	id: z.uuid(),
	type: z.literal("session.revoked"),
	data: z.object({
		sid: z.string().regex(SESSION_ID_REGEX),
		reason: z.string().optional()
	}),
	timestamp: z.iso.datetime().optional()
})

export const sessionRevokedAllEventScheme = z.object({
	id: z.uuid(),
	type: z.literal("session.revoked.all"),
	data: z.object({
		sid: z.string().regex(SESSION_ID_REGEX),
		reason: z.string().optional()
	}),
	timestamp: z.iso.datetime().optional()
})

export const settingsUpdatedEventScheme = z.object({
	id: z.uuid(),
	type: z.literal("settings.updated"),
	data: z.object({
		version: z.number().int().positive(),
		session_expire_term: z.string().optional(),
		session_2fa_enabled: z.boolean().optional(),
		preferences: z
			.object({
				theme: z.string().optional(),
				accent: z.string().optional(),
				animations: z.string().optional(),
				density: z.string().optional(),
				text_size: z.string().optional(),
				confirm_important_actions: z.boolean().optional()
			})
			.partial()
			.optional(),
		notifications: z
			.object({
				requests: z.boolean().optional(),
				sessions: z.boolean().optional(),
				system: z.boolean().optional(),
				push: z.boolean().optional()
			})
			.partial()
			.optional()
	}),
	timestamp: z.iso.datetime().optional()
})

const userAvatarUpdatedData = z.object({
	avatar: z.string().regex(AVATAR_FILE_ID_REGEX).nullable()
})

export const userAvatarUpdatedScheme = z.object({
	id: z.uuid(),
	type: z.literal("user.avatar.updated"),
	data: userAvatarUpdatedData,
	timestamp: z.iso.datetime().optional()
})

export const wsServerEventScheme = z.discriminatedUnion("type", [
	presenceOnlineEventScheme,
	presenceOfflineEventScheme,
	sessionCreatedEventScheme,
	sessionUpdatedEventScheme,
	sessionRevokedEventScheme,
	sessionRevokedAllEventScheme,
	settingsUpdatedEventScheme,
	userAvatarUpdatedScheme
])

export const wsPongScheme = z.object({
	id: z.uuid(),
	type: z.literal("realtime.pong"),
	timestamp: z.iso.datetime().optional()
})

export const wsIncomingMessageScheme = z.discriminatedUnion("type", [
	wsAuthSuccessScheme,
	wsAuthErrorScheme,
	wsServerEventScheme,
	wsPongScheme
])

export type WsAuthSuccessSchema = z.infer<typeof wsAuthSuccessScheme>
export type WsAuthErrorSchema = z.infer<typeof wsAuthErrorScheme>
export type PresenceOnlineEventSchema = z.infer<
	typeof presenceOnlineEventScheme
>
export type PresenceOfflineEventSchema = z.infer<
	typeof presenceOfflineEventScheme
>
export type SessionCreatedEventSchema = z.infer<
	typeof sessionCreatedEventScheme
>
export type SessionUpdatedEventSchema = z.infer<
	typeof sessionUpdatedEventScheme
>
export type SessionRevokedEventSchema = z.infer<
	typeof sessionRevokedEventScheme
>
export type SessionRevokedAllEventSchema = z.infer<
	typeof sessionRevokedAllEventScheme
>
export type WsServerEventSchema = z.infer<typeof wsServerEventScheme>
export type WsPongSchema = z.infer<typeof wsPongScheme>
export type WsIncomingMessageSchema = z.infer<typeof wsIncomingMessageScheme>
