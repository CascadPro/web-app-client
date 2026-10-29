import { z } from "zod"

const sidRegex = /^[a-f0-9]{24}$/

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
		sid: z.string().regex(sidRegex),
		uid: z.uuid()
	}),
	timestamp: z.iso.datetime().optional()
})

export const presenceOfflineEventScheme = z.object({
	id: z.uuid(),
	type: z.literal("presence.offline"),
	data: z.object({
		sid: z.string().regex(sidRegex),
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
		sid: z.string().regex(sidRegex),
		reason: z.string().optional()
	}),
	timestamp: z.iso.datetime().optional()
})

export const sessionRevokedAllEventScheme = z.object({
	id: z.uuid(),
	type: z.literal("session.revoked.all"),
	data: z.object({
		sid: z.string().regex(sidRegex),
		reason: z.string().optional()
	}),
	timestamp: z.iso.datetime().optional()
})

export const wsServerEventScheme = z.discriminatedUnion("type", [
	presenceOnlineEventScheme,
	presenceOfflineEventScheme,
	sessionCreatedEventScheme,
	sessionUpdatedEventScheme,
	sessionRevokedEventScheme,
	sessionRevokedAllEventScheme
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
