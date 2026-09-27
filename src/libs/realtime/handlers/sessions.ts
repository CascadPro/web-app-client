import type { QueryClient } from "@tanstack/react-query"
import type { AxiosResponse } from "axios"

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

export function handleSessionCreated(
	client: QueryClient,
	event: { data: SessionCreatedEventData }
): void {
	client.setQueryData<AxiosResponse<SessionsData>>(
		QueryKeys.sessions.all,
		response => {
			const data = response?.data

			if (!data) {
				return response
			}

			const exists = data.sessions.some(
				session => session.id === event.data.session.id
			)

			if (exists) {
				return response
			}

			return {
				...response,
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
	client.setQueryData<AxiosResponse<SessionsData>>(
		QueryKeys.sessions.all,
		response => {
			const data = response?.data

			if (!data) {
				return response
			}

			const session = event.data.session

			if (data.current_session.id === session.id) {
				return {
					...response,
					data: {
						...data,
						current_session: session
					}
				}
			}

			return {
				...response,
				data: {
					...data,
					sessions: data.sessions.map(item =>
						item.id === session.id ? session : item
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
	let isCurrentSession = false

	client.setQueryData<AxiosResponse<SessionsData>>(
		QueryKeys.sessions.all,
		response => {
			const data = response?.data

			if (!data) {
				return response
			}

			if (data.current_session.id === event.data.sid) {
				isCurrentSession = true
				return undefined
			}

			return {
				...response,
				data: {
					...data,
					sessions: data.sessions.filter(
						session => session.id !== event.data.sid
					)
				}
			}
		}
	)

	return isCurrentSession
}

export function handleSessionRevokedAll(
	client: QueryClient,
	event: { data: SessionRevokedEventData }
): boolean {
	let isCurrentSession = false

	client.setQueryData<AxiosResponse<SessionsData>>(
		QueryKeys.sessions.all,
		response => {
			const data = response?.data

			if (!data) {
				return response
			}

			if (data.current_session.id === event.data.sid) {
				isCurrentSession = true

				return {
					...response,
					data: {
						...data,
						sessions: []
					}
				}
			}

			return undefined
		}
	)

	return isCurrentSession
}
