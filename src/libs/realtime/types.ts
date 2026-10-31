import type { SessionsHttpDtoSessionDTO } from "@/api/generated"
import type { UserSettingsResponse } from "@/api/settings"

import { WS_AUTH_EVENTS, WS_EVENTS, type WsEventType } from "./events"

export interface WsEvent<T = unknown> {
	id: string
	type: string
	data: T
}

export interface WsAuthMessage {
	type: typeof WS_AUTH_EVENTS.AUTH_REQUEST
	token: string
}

export interface WsAuthSuccess {
	type: typeof WS_AUTH_EVENTS.AUTH_SUCCESS
	message: string
}

export interface WsAuthError {
	type: typeof WS_AUTH_EVENTS.AUTH_ERROR
	code: string
	message: string
	timestamp: string
}

export interface PresenceEventData {
	uid: string
	sid: string
}

export interface SessionRevokedEventData {
	sid: string
	reason?: string
}

export interface SessionCreatedEventData {
	session: SessionsHttpDtoSessionDTO
}

export interface SessionUpdatedEventData {
	session: SessionsHttpDtoSessionDTO
}

export interface PresenceOnlineEvent extends WsEvent<PresenceEventData> {
	type: typeof WS_EVENTS.PRESENCE_ONLINE
}

export interface PresenceOfflineEvent extends WsEvent<PresenceEventData> {
	type: typeof WS_EVENTS.PRESENCE_OFFLINE
}

export interface SessionCreatedEvent extends WsEvent<SessionCreatedEventData> {
	type: typeof WS_EVENTS.SESSION_CREATED
}

export interface SessionUpdatedEvent extends WsEvent<SessionUpdatedEventData> {
	type: typeof WS_EVENTS.SESSION_UPDATED
}

export interface SessionRevokedEvent extends WsEvent<SessionRevokedEventData> {
	type: typeof WS_EVENTS.SESSION_REVOKED
}

export interface SessionRevokedAllEvent extends WsEvent<SessionRevokedEventData> {
	type: typeof WS_EVENTS.SESSION_REVOKED_ALL
}

export interface SettingsUpdatedEventData {
	version: number
	session_expire_term?: UserSettingsResponse["session_expire_term"]
	session_2fa_enabled?: boolean
	preferences?: Partial<UserSettingsResponse["preferences"]>
	notifications?: Partial<UserSettingsResponse["notifications"]>
}

export interface SettingsUpdatedEvent extends WsEvent<SettingsUpdatedEventData> {
	type: typeof WS_EVENTS.SETTINGS_UPDATED
}

export interface UserAvatarUpdatedEventData {
	avatar: string | null
}

export interface UserAvatarUpdatedEvent extends WsEvent<UserAvatarUpdatedEventData> {
	type: typeof WS_EVENTS.USER_AVATAR_UPDATED
}

export interface UserUpdatedEventData extends Partial<UserAvatarUpdatedEventData> {}

export interface UserUpdatedEvent extends WsEvent<UserUpdatedEventData> {
	type: typeof WS_EVENTS.USER_UPDATED
}

export type WsServerEvent =
	| PresenceOnlineEvent
	| PresenceOfflineEvent
	| SessionCreatedEvent
	| SessionUpdatedEvent
	| SessionRevokedEvent
	| SessionRevokedAllEvent
	| SettingsUpdatedEvent
	| UserAvatarUpdatedEvent
	| UserUpdatedEvent

export type WsMessage = WsAuthSuccess | WsAuthError | WsServerEvent

/**
 * Тип события по его имени.
 *
 * WsEventByType<"presence.online"> -> PresenceOnlineEvent
 * WsEventByType<"session.created"> -> SessionCreatedEvent
 */
export type WsEventByType<T extends WsEventType> = Extract<
	WsServerEvent,
	{ type: T }
>

export type WsEventHandler<T extends WsEventType> = (
	event: WsEventByType<T>
) => void
