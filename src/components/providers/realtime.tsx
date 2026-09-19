"use client"

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";



import { queryClient } from "@/libs/query/client";
import { QueryKeys } from "@/libs/query/keys";
import { WebSocketClient } from "@/libs/realtime";
import { WS_EVENTS } from "@/libs/realtime/events";
import { handlePresenceOffline, handlePresenceOnline, handleSessionCreated, handleSessionRevoked, handleSessionUpdated } from "@/libs/realtime/handlers/sessions";
import { useAuthStore } from "@/store/auth";















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
				void queryClient.invalidateQueries({ queryKey: QueryKeys.sessions.all })
			},
		})

		clientRef.current = client

		const unsubscribePresenceOnline = client.on<{ sid: string }>(
			WS_EVENTS.PRESENCE_ONLINE,
			event => {
				handlePresenceOnline(queryClient, event.data.sid)
			}
		)

		const unsubscribePresenceOffline = client.on<{ sid: string }>(
			WS_EVENTS.PRESENCE_OFFLINE,
			event => {
				handlePresenceOffline(queryClient, event.data.sid)
			}
		)

		const unsubscribeSessionCreated = client.on(
			WS_EVENTS.SESSION_CREATED,
			event => {
				handleSessionCreated(queryClient, event as never)
			}
		)

		const unsubscribeSessionUpdated = client.on(
			WS_EVENTS.SESSION_UPDATED,
			event => {
				handleSessionUpdated(queryClient, event as never)
			}
		)

		const unsubscribeSessionRevoked = client.on<{
			sid: string
			reason?: string
		}>(WS_EVENTS.SESSION_REVOKED, event => {
			const currentSessionRevoked = handleSessionRevoked(queryClient, event)

			if (!currentSessionRevoked) {
				return
			}

			useAuthStore.getState().setUnauthenticated()

			router.replace("/login")
		})

		const handleBrowserOnline = () => {
			client.reconnect()

			void queryClient.invalidateQueries({
				queryKey: QueryKeys.sessions.all
			})
		}

		const handleVisibilityChange = () => {
			if (document.visibilityState !== "visible") {
				return
			}

			if (!client.isConnected()) {
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
