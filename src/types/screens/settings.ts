import type { LucideIcon } from "lucide-react"

import type {
	AccentPreference,
	AnimationPreference,
	DensityPreference,
	SessionExpireTerm,
	TextSizePreference,
	ThemePreference
} from "@/api/settings"

export type {
	AccentPreference,
	AnimationPreference,
	DensityPreference,
	SessionExpireTerm,
	TextSizePreference,
	ThemePreference
} from "@/api/settings"

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
	textSize: TextSizePreference
	confirmImportantActions: boolean
	sessionExpireTerm: SessionExpireTerm
	session2FAEnabled: boolean
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
	syncing: boolean
	pendingOfflineChanges: boolean
	updateSettings: (patch: Partial<SettingsUpdate>) => void
	updateNotification: (key: NotificationKey, value: boolean) => void
}
