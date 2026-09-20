import type { QueryClient } from "@tanstack/react-query"
import { AxiosResponse } from "axios"

import type { SessionsHttpDtoSessionDTO } from "@/api/generated"
import { QueryKeys } from "@/libs/query/keys"

import type {
	SessionCreatedEventData,
	SessionRevokedEventData,
	SessionUpdatedEventData
} from "../types"

interface SessionsData {
	current_session: SessionsHttpDtoSessionDTO
	sessions: SessionsHttpDtoSessionDTO[]
}

function updateSession(
	data: SessionsData | undefined,
	session: SessionsHttpDtoSessionDTO
): SessionsData | undefined {
	if (!data) return data

	if (data.current_session.id === session.id) {
		return {
			...data,
			current_session: session
		}
	}

	return {
		...data,
		sessions: data.sessions.map(item =>
			item.id === session.id ? session : item
		)
	}
}

export function handleSessionCreated(
	queryClient: QueryClient,
	event: { data: SessionCreatedEventData }
): void {
	queryClient.setQueryData<AxiosResponse<SessionsData>>(
		QueryKeys.sessions.all,
		r => {
			const data = r?.data
			if (!data) return r

			const exists = data.sessions.some(
				session => session.id === event.data.session.id
			)

			if (exists) return r

			return {
				...r,
				data: {
					...data,
					sessions: [...data.sessions, event.data.session]
				}
			}
		}
	)
}

export function handleSessionUpdated(
	client: QueryClient,
	event: { data: SessionUpdatedEventData }
): void {
	client.setQueryData<AxiosResponse<SessionsData | undefined>>(
		QueryKeys.sessions.all,
		r => {
			const data = r?.data
			if (!data) return r

			return { ...r, data: updateSession(data, event.data.session) }
		}
	)
}

export function handlePresenceOnline(client: QueryClient, sid: string): void {
	updateSessionOnlineState(client, sid, true)
}

export function handlePresenceOffline(client: QueryClient, sid: string): void {
	updateSessionOnlineState(client, sid, false)
}

function updateSessionOnlineState(
	client: QueryClient,
	sid: string,
	online: boolean
): void {
	client.setQueryData<AxiosResponse<SessionsData>>(
		QueryKeys.sessions.all,
		r => {
			const data = r?.data
			if (!data) return r

			if (data?.current_session.id === sid) {
				return {
					...r,
					data: {
						...data,
						current_session: { ...data.current_session, online }
					}
				}
			}

			return {
				...r,
				data: {
					...data,
					sessions: data?.sessions?.map(session =>
						session.id === sid
							? { ...session, online, last_active_at: new Date().toISOString() }
							: session
					)
				}
			}
		}
	)
}

export function handleSessionRevoked(
	client: QueryClient,
	event: { data: SessionRevokedEventData }
): boolean {
	let currentSessionRevoked = false

	client.setQueryData<AxiosResponse<SessionsData>>(
		QueryKeys.sessions.all,
		r => {
			const data = r?.data
			if (!data) return r

			if (data.current_session.id === event.data.sid) {
				currentSessionRevoked = true
				return undefined
			}

			return {
				...r,
				data: {
					...data,
					sessions: data.sessions.filter(
						session => session.id !== event.data.sid
					)
				}
			}
		}
	)

	return currentSessionRevoked
}

export function handleSessionRevokedAll(
	client: QueryClient,
	event: { data: SessionRevokedEventData }
): boolean {
	let isCurrentSession = false

	client.setQueryData<AxiosResponse<SessionsData>>(
		QueryKeys.sessions.all,
		r => {
			const data = r?.data
			if (!data) return r

			if (data.current_session.id === event.data.sid) {
				isCurrentSession = true

				return {
					...r,
					data: { ...data, sessions: [] }
				}
			}

			return undefined
		}
	)

	return isCurrentSession
}
