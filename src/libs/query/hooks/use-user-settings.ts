"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useCallback, useEffect } from "react"

import {
	getUserSettings,
	PatchUserSettingsRequest,
	UserSettingsResponse
} from "@/api/settings"
import { ms } from "@/libs/utils"
import {
	enqueueSettingsChanges,
	flushSettingsQueue,
	getQueuedSettingsChanges
} from "@/libs/utils/screens/settings"
import { useAuthStore } from "@/store/auth"

import { QueryKeys } from "../keys"

type SettingsChanges = Omit<PatchUserSettingsRequest, "version">

const SETTINGS_QUERY_KEY = QueryKeys.settings.current()

const mergeSettings = (
	current: UserSettingsResponse,
	changes: SettingsChanges
): UserSettingsResponse => ({
	...current,
	...(changes as any),
	preferences: { ...current.preferences, ...changes.preferences },
	notifications: { ...current.notifications, ...changes.notifications }
})

export const useUserSettings = () => {
	const status = useAuthStore(state => state.status)
	const queryClient = useQueryClient()

	const query = useQuery({
		queryKey: SETTINGS_QUERY_KEY,
		queryFn: async () => {
			const serverSettings = await getUserSettings()
			const queued = await getQueuedSettingsChanges()
			return queued ? mergeSettings(serverSettings, queued) : serverSettings
		},
		enabled: status === "authenticated",
		staleTime: ms("5min"),
		gcTime: ms("24h"),
		networkMode: "offlineFirst"
	})

	const updateSettings = useCallback(
		async (changes: SettingsChanges) => {
			const current =
				queryClient.getQueryData<UserSettingsResponse>(SETTINGS_QUERY_KEY)
			if (!current) return

			// Optimistic UI update is reflected in the persisted TanStack Query cache.
			queryClient.setQueryData(
				SETTINGS_QUERY_KEY,
				mergeSettings(current, changes)
			)

			await enqueueSettingsChanges(changes)

			if (typeof navigator !== "undefined" && navigator.onLine) {
				const updated = await flushSettingsQueue()
				if (updated) queryClient.setQueryData(SETTINGS_QUERY_KEY, updated)
			}
		},
		[queryClient, SETTINGS_QUERY_KEY]
	)

	useEffect(() => {
		if (status !== "authenticated") return

		const flush = async () => {
			const updated = await flushSettingsQueue()

			if (updated) {
				queryClient.setQueryData(SETTINGS_QUERY_KEY, updated)
			} else {
				const queued = await getQueuedSettingsChanges()

				if (queued) {
					queryClient.setQueryData<UserSettingsResponse>(
						SETTINGS_QUERY_KEY,
						current => (current ? mergeSettings(current, queued) : current)
					)
				}
			}
		}

		void flush()

		window.addEventListener("online", flush)

		return () => window.removeEventListener("online", flush)
	}, [queryClient, SETTINGS_QUERY_KEY, status])

	return { ...query, updateSettings }
}
