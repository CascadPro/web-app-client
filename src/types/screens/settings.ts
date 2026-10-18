import type { LucideIcon } from "lucide-react"

export type ThemePreference = "system" | "light" | "dark"

export type AccentPreference =
	"orange" | "blue" | "mauve" | "green" | "teal" | "rose"

export type AnimationPreference = "system" | "enabled" | "disabled"

export type DensityPreference = "comfortable" | "compact"

export interface NotificationSettings {
	requests: boolean
	sessions: boolean
	system: boolean
	push: boolean
}

export interface SettingsState {
	theme: ThemePreference
	accent: AccentPreference
	animations: AnimationPreference
	density: DensityPreference
	notifications: NotificationSettings
}

export type SettingsUpdate = {
	[K in Exclude<keyof SettingsState, "notifications">]: SettingsState[K]
}

export type NotificationKey = keyof NotificationSettings

export interface SettingsOption<T extends string> {
	value: T
	label: string
	description?: string
}

export interface SettingsNotificationRow {
	key: NotificationKey
	title: string
	description: string
	icon: LucideIcon
}

export interface SettingsContextValue {
	settings: SettingsState
	hydrated: boolean
	updateSettings: (patch: Partial<SettingsUpdate>) => void
	updateNotification: (key: NotificationKey, value: boolean) => void
}
