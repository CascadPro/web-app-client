import type { QueryClient } from "@tanstack/react-query"

import type { UserSettingsResponse } from "@/api/settings"
import { QueryKeys } from "@/libs/query/keys"
import type { SettingsUpdatedEventData } from "@/libs/realtime/types"

export function handleSettingsUpdated(
	client: QueryClient,
	event: { data: SettingsUpdatedEventData }
): void {
	const queryKey = QueryKeys.settings.current()
	const changes = event.data

	const current = client.getQueryData<UserSettingsResponse>(queryKey)

	if (!current) {
		void client.invalidateQueries({ queryKey })
		return
	}

	// Игнорируем повторно доставленное или устаревшее событие.
	if (changes.version <= current.version) {
		return
	}

	// Если пропущена хотя бы одна версия, частичного события недостаточно
	// для восстановления полного состояния настроек.
	if (changes.version !== current.version + 1) {
		void client.invalidateQueries({ queryKey, exact: true })
		return
	}

	client.setQueryData<UserSettingsResponse>(queryKey, previous => {
		if (!previous) {
			return previous
		}

		return {
			...previous,
			...changes,
			version: changes.version,
			preferences: {
				...previous.preferences,
				...changes.preferences
			},
			notifications: {
				...previous.notifications,
				...changes.notifications
			}
		}
	})
}
