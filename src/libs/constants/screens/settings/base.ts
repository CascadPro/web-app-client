import type { SettingsState } from "@/types/screens/settings"

export const SETTINGS_STORAGE_KEY = "cascade:settings:v1"

export const DEFAULT_SETTINGS: SettingsState = {
	theme: "system",
	accent: "orange",
	animations: "system",
	density: "comfortable",
	textSize: "medium",
	confirmImportantActions: true,
	sessionExpireTerm: "30d",
	session2FAEnabled: false,
	notifications: {
		requests: true,
		sessions: true,
		system: true,
		push: false
	}
}

export { ACCENT_COLORS } from "@/libs/design/palette"

export const SETTINGS_CACHE_PREFIX = "cascade-pwa-"
