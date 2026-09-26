import type { SessionsHttpDtoSessionDTO } from "@/api/generated";

import { WS_AUTH_EVENTS, WS_EVENTS, type WsEventType } from "./events"

export interface WsEvent<T = unknown> {
	id: string
	type: string
	data: T
	timestamp: string
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
	timestamp: number
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

export type WsServerEvent =
	| PresenceOnlineEvent
	| PresenceOfflineEvent
	| SessionCreatedEvent
	| SessionUpdatedEvent
	| SessionRevokedEvent
	| SessionRevokedAllEvent

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
