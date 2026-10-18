import {
	DEFAULT_SETTINGS,
	SETTINGS_STORAGE_KEY
} from "@/libs/constants/screens/settings"
import { storedSettingsScheme } from "@/libs/schemes"
import type { SettingsState } from "@/types/screens/settings"

import { isDev } from "../is-dev"

export const readSettings = (): SettingsState => {
	if (typeof window === "undefined") {
		return DEFAULT_SETTINGS
	}

	try {
		const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY)

		if (!raw) {
			return DEFAULT_SETTINGS
		}

		const result = storedSettingsScheme.safeParse(JSON.parse(raw))

		if (!result.success) {
			return DEFAULT_SETTINGS
		}

		const saved = result.data

		return {
			...DEFAULT_SETTINGS,
			...saved,
			notifications: {
				...DEFAULT_SETTINGS.notifications,
				...saved.notifications
			}
		}
	} catch {
		return DEFAULT_SETTINGS
	}
}

export const writeSettings = (value: SettingsState): void => {
	if (typeof window === "undefined") {
		return
	}

	try {
		const serialized = JSON.stringify(value)
		const current = window.localStorage.getItem(SETTINGS_STORAGE_KEY)

		if (current === serialized) {
			return
		}

		window.localStorage.setItem(SETTINGS_STORAGE_KEY, serialized)
	} catch (error) {
		if (isDev()) {
			console.error("failed to write settings to storage", error)
		}
	}
}
