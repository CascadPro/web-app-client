import type {
	PatchUserSettingsRequest,
	UserSettingsResponse
} from "@/api/settings"
import {
	DEFAULT_SETTINGS,
	SETTINGS_STORAGE_KEY
} from "@/libs/constants/screens/settings"
import { storedSettingsScheme } from "@/libs/schemes"
import type { SettingsState } from "@/types/screens/settings"

import { isDev } from "../../is-dev"

export const readSettings = (): SettingsState => {
	if (typeof window === "undefined") return DEFAULT_SETTINGS

	try {
		const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY)
		if (!raw) return DEFAULT_SETTINGS

		const result = storedSettingsScheme.safeParse(JSON.parse(raw))
		if (!result.success) return DEFAULT_SETTINGS

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
	if (typeof window === "undefined") return

	try {
		const serialized = JSON.stringify(value)

		if (window.localStorage.getItem(SETTINGS_STORAGE_KEY) === serialized) return

		window.localStorage.setItem(SETTINGS_STORAGE_KEY, serialized)
	} catch (error) {
		if (isDev()) {
			console.error("failed to write settings to storage", error)
		}
	}
}

export const settingsFromResponse = (
	response: UserSettingsResponse
): SettingsState => ({
	theme: response.preferences.theme,
	accent: response.preferences.accent,
	animations: response.preferences.animations,
	density: response.preferences.density,
	textSize: response.preferences.text_size,
	confirmImportantActions: response.preferences.confirm_important_actions,
	sessionExpireTerm: response.session_expire_term,
	session2FAEnabled: response.session_2fa_enabled,
	notifications: { ...response.notifications }
})

export const settingsToPatch = (
	patch: Partial<SettingsState>
): Omit<PatchUserSettingsRequest, "version"> => {
	const result: Omit<PatchUserSettingsRequest, "version"> = {}
	const preferences: NonNullable<PatchUserSettingsRequest["preferences"]> = {}
	const notifications: NonNullable<PatchUserSettingsRequest["notifications"]> =
		{}

	if (patch.theme !== undefined) preferences.theme = patch.theme
	if (patch.accent !== undefined) preferences.accent = patch.accent
	if (patch.animations !== undefined) preferences.animations = patch.animations
	if (patch.density !== undefined) preferences.density = patch.density
	if (patch.textSize !== undefined) preferences.text_size = patch.textSize

	if (patch.confirmImportantActions !== undefined)
		preferences.confirm_important_actions = patch.confirmImportantActions

	if (Object.keys(preferences).length) result.preferences = preferences

	if (patch.sessionExpireTerm !== undefined)
		result.session_expire_term = patch.sessionExpireTerm

	if (patch.session2FAEnabled !== undefined)
		result.session_2fa_enabled = patch.session2FAEnabled

	if (patch.notifications) {
		for (const key of ["requests", "sessions", "system", "push"] as const) {
			if (patch.notifications[key] !== undefined)
				notifications[key] = patch.notifications[key]
		}

		if (Object.keys(notifications).length) result.notifications = notifications
	}

	return result
}
