import type { SettingsState } from "@/types/screens/settings"

export const SETTINGS_STORAGE_KEY = "cascade:settings:v1"

export const DEFAULT_SETTINGS: SettingsState = {
	theme: "system",
	accent: "orange",
	animations: "system",
	density: "comfortable",
	notifications: {
		requests: true,
		sessions: true,
		system: true,
		push: false
	}
}

export const ACCENT_COLORS = {
	orange: {
		primary: "#ff9800",
		container: "#ffb74d",
		onPrimary: "#ffffff"
	},
	blue: {
		primary: "#64b5f6",
		container: "#1976d2",
		onPrimary: "#ffffff"
	},
	mauve: {
		primary: "#cba6f7",
		container: "#8839ef",
		onPrimary: "#ffffff"
	},
	green: {
		primary: "#a6e3a1",
		container: "#40a02b",
		onPrimary: "#ffffff"
	}
} as const

export const SETTINGS_CACHE_PREFIX = "cascade-pwa-"
