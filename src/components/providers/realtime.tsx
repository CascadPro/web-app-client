"use client"

import { useRouter } from "next/navigation"
import { useEffect, useRef } from "react"

import { AppRoutes } from "@/libs/constants"
import { queryClient } from "@/libs/query/client"
import { QueryKeys } from "@/libs/query/keys"
import { WebSocketClient } from "@/libs/realtime"
import { WS_EVENTS } from "@/libs/realtime/events"
import {
	handlePresenceOffline,
	handlePresenceOnline,
	handleSessionCreated,
	handleSessionRevoked,
	handleSessionRevokedAll,
	handleSessionUpdated
} from "@/libs/realtime/handlers/sessions"
import { useAuthStore } from "@/store/auth"

interface RealtimeProviderProps {
	children: React.ReactNode
}

const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:8000/ws"

export function RealtimeProvider({ children }: RealtimeProviderProps) {
	const router = useRouter()

	const clientRef = useRef<WebSocketClient | null>(null)

	const status = useAuthStore(state => state.status)
	const accessToken = useAuthStore(state => state.accessToken)

	useEffect(() => {
		if (status !== "authenticated" || !accessToken) {
			clientRef.current?.disconnect()
			clientRef.current = null

			return
		}

		const client = new WebSocketClient({
			url: WS_URL,

			getAccessToken: () => useAuthStore.getState().accessToken,

			onAuthenticated: () => {
				void queryClient.invalidateQueries({
					queryKey: QueryKeys.sessions.all
				})
			}
		})

		clientRef.current = client

		const unsubscribePresenceOnline = client.on(
			WS_EVENTS.PRESENCE_ONLINE,
			event => {
				if (event.type !== WS_EVENTS.PRESENCE_ONLINE) return
				handlePresenceOnline(queryClient, event.data.sid)
			}
		)

		const unsubscribePresenceOffline = client.on(
			WS_EVENTS.PRESENCE_OFFLINE,
			event => {
				if (event.type !== WS_EVENTS.PRESENCE_OFFLINE) return
				handlePresenceOffline(queryClient, event.data.sid)
			}
		)

		const unsubscribeSessionCreated = client.on(
			WS_EVENTS.SESSION_CREATED,
			event => {
				if (event.type !== WS_EVENTS.SESSION_CREATED) return
				handleSessionCreated(queryClient, event)
			}
		)

		const unsubscribeSessionUpdated = client.on(
			WS_EVENTS.SESSION_UPDATED,
			event => {
				if (event.type !== WS_EVENTS.SESSION_UPDATED) return
				handleSessionUpdated(queryClient, event)
			}
		)

		const unsubscribeSessionRevoked = client.on(
			WS_EVENTS.SESSION_REVOKED,
			event => {
				if (event.type !== WS_EVENTS.SESSION_REVOKED) return

				const currentSessionRevoked = handleSessionRevoked(queryClient, event)

				if (!currentSessionRevoked) return

				useAuthStore.getState().setUnauthenticated()

				router.replace(AppRoutes.LOGIN)
			}
		)

		const unsubscribeSessionRevokedAll = client.on(
			WS_EVENTS.SESSION_REVOKED_ALL,
			event => {
				if (event.type != WS_EVENTS.SESSION_REVOKED_ALL) return

				const isCurrentSession = handleSessionRevokedAll(queryClient, event)

				if (isCurrentSession) return

				useAuthStore.getState().setUnauthenticated()

				router.replace(AppRoutes.LOGIN)
			}
		)

		const handleBrowserOnline = () => {
			if (!client.isAuthenticated()) {
				client.reconnect()
			}

			void queryClient.invalidateQueries({
				queryKey: QueryKeys.sessions.all
			})
		}

		const handleVisibilityChange = () => {
			if (document.visibilityState !== "visible") {
				return
			}

			if (!client.isAuthenticated()) {
				client.reconnect()
			}

			void queryClient.invalidateQueries({
				queryKey: QueryKeys.sessions.all
			})
		}

		window.addEventListener("online", handleBrowserOnline)

		document.addEventListener("visibilitychange", handleVisibilityChange)

		client.connect()

		return () => {
			unsubscribePresenceOnline()
			unsubscribePresenceOffline()
			unsubscribeSessionCreated()
			unsubscribeSessionUpdated()
			unsubscribeSessionRevoked()
			unsubscribeSessionRevokedAll()

			window.removeEventListener("online", handleBrowserOnline)

			document.removeEventListener("visibilitychange", handleVisibilityChange)

			client.disconnect()

			if (clientRef.current === client) {
				clientRef.current = null
			}
		}
	}, [status, accessToken, router])

	return children
}
