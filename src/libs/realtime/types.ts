import type { SessionsHttpDtoSessionDTO } from "@/api/generated"

import { WS_EVENTS, type WsEventType } from "./events"

export interface WsEvent<T = unknown> {
	id: string
	type: WsEventType
	data: T
	timestamp: string
}

export interface WsAuthMessage {
	type: typeof WS_EVENTS.AUTH_REQUEST
	token: string
}

export interface WsAuthSuccess {
	type: typeof WS_EVENTS.AUTH_SUCCESS
	message: string
}

export interface WsAuthError {
	type: typeof WS_EVENTS.AUTH_ERROR
	code: string
	message: string
}

export interface PresenceEventData {
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

export type PresenceEvent = WsEvent<PresenceEventData>

export type SessionRevokedEvent = WsEvent<SessionRevokedEventData>

export type SessionCreatedEvent = WsEvent<SessionCreatedEventData>

export type SessionUpdatedEvent = WsEvent<SessionUpdatedEventData>

export type WsMessage = WsEvent | WsAuthSuccess | WsAuthError
