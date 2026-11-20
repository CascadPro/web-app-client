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

export interface RequestCreatedEventData {
	id: string
	title: string
	status: string
	client_id?: string | null
	created_at: string
}

export interface RequestCreatedEvent extends WsEvent<RequestCreatedEventData> {
	type: typeof WS_EVENTS.REQUEST_CREATED
}

export interface RequestUpdatedEventData {
	id: string
	title?: string | null
	status?: string | null
	client_id?: string | null
	deadline?: string | null
	work_types?: string[]
	geography?: string[]
	origin?: unknown[]
	updated_at: string
}

export interface RequestUpdatedEvent extends WsEvent<RequestUpdatedEventData> {
	type: typeof WS_EVENTS.REQUEST_UPDATED
}

export interface RequestStatusChangedEventData {
	id: string
	status: string
	status_by: string
	updated_at: string
}

export interface RequestStatusChangedEvent extends WsEvent<RequestStatusChangedEventData> {
	type: typeof WS_EVENTS.REQUEST_STATUS_CHANGED
}

export interface RequestFileEventData {
	id: string
	request_id: string
	slot: number
	filename: string
	size: number
	mime_type: string
	created_at: string
}

export interface RequestFileUploadedEvent extends WsEvent<RequestFileEventData> {
	type: typeof WS_EVENTS.REQUEST_FILE_UPLOADED
}

export interface RequestFileDeletedEvent extends WsEvent<RequestFileEventData> {
	type: typeof WS_EVENTS.REQUEST_FILE_DELETED
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
	| RequestCreatedEvent
	| RequestUpdatedEvent
	| RequestStatusChangedEvent
	| RequestFileUploadedEvent
	| RequestFileDeletedEvent

export type WsMessage = WsAuthSuccess | WsAuthError | WsServerEvent

export type WsEventByType<T extends WsEventType> = Extract<
	WsServerEvent,
	{ type: T }
>

export type WsEventHandler<T extends WsEventType> = (
	event: WsEventByType<T>
) => void
