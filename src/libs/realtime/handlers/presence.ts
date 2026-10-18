import type { QueryClient } from "@tanstack/react-query"
import type { AxiosResponse } from "axios"

import type { SessionsHttpDtoSessionDTO } from "@/api/generated"
import { toast } from "@/components/ui/toast"
import { QueryKeys } from "@/libs/query/keys"
import { parseDevice } from "@/libs/utils/screens/sessions"

interface SessionsData {
	current_session: SessionsHttpDtoSessionDTO
	sessions: SessionsHttpDtoSessionDTO[]
}

export function handlePresenceOnline(client: QueryClient, sid: string): void {
	updateSessionOnlineState(client, sid, true)

	const data = client.getQueryData<AxiosResponse<SessionsData>>(
		QueryKeys.sessions.all
	)
	const session = data?.data.sessions.find(s => s.id === sid)

	if (session) {
		const device = parseDevice(session.metadata?.device)

		toast.info("Активный сеанс", {
			description: `${device.label} в сети`,
			duration: 2000
		})
	}
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
		response => {
			const data = response?.data

			if (!data) {
				return response
			}

			if (data.current_session.id === sid) {
				return {
					...response,
					data: {
						...data,
						current_session: {
							...data.current_session,
							online
						}
					}
				}
			}

			return {
				...response,
				data: {
					...data,
					sessions: data.sessions.map(session =>
						session.id === sid
							? {
									...session,
									online,
									last_active_at: new Date().toISOString()
								}
							: session
					)
				}
			}
		}
	)
}
