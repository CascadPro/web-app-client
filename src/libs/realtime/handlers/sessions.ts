import type { QueryClient } from "@tanstack/react-query"

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
	if (!data) {
		return data
	}

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
	queryClient.setQueryData<SessionsData>(QueryKeys.sessions.all, current => {
		if (!current) {
			return current
		}

		const exists = current.sessions.some(
			session => session.id === event.data.session.id
		)

		if (exists) {
			return current
		}

		return {
			...current,
			sessions: [...current.sessions, event.data.session]
		}
	})
}

export function handleSessionUpdated(
	queryClient: QueryClient,
	event: { data: SessionUpdatedEventData }
): void {
	queryClient.setQueryData<SessionsData>(QueryKeys.sessions.all, current =>
		updateSession(current, event.data.session)
	)
}

export function handlePresenceOnline(
	queryClient: QueryClient,
	sessionId: string
): void {
	updateSessionOnlineState(queryClient, sessionId, true)
}

export function handlePresenceOffline(
	queryClient: QueryClient,
	sessionId: string
): void {
	updateSessionOnlineState(queryClient, sessionId, false)
}

function updateSessionOnlineState(
	queryClient: QueryClient,
	sessionId: string,
	online: boolean
): void {
	queryClient.setQueryData<SessionsData>(QueryKeys.sessions.all, current => {
		if (!current) {
			return current
		}

		console.log(current, sessionId)

		if (current?.current_session.id === sessionId) {
			return {
				...current,
				current_session: {
					...current.current_session,
					online
				}
			}
		}

		return {
			...current,
			sessions: current.sessions.map(session =>
				session.id === sessionId
					? {
							...session,
							online
						}
					: session
			)
		}
	})
}

export function handleSessionRevoked(
	queryClient: QueryClient,
	event: { data: SessionRevokedEventData }
): boolean {
	let currentSessionRevoked = false

	queryClient.setQueryData<SessionsData>(QueryKeys.sessions.all, current => {
		if (!current) {
			return current
		}

		if (current.current_session.id === event.data.sid) {
			currentSessionRevoked = true
			return undefined
		}

		return {
			...current,
			sessions: current.sessions.filter(
				session => session.id !== event.data.sid
			)
		}
	})

	return currentSessionRevoked
}
