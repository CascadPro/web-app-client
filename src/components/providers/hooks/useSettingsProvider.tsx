"use client"

import { useReducedMotion } from "motion/react"
import { useTheme } from "next-themes"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import {
	ACCENT_COLORS,
	DEFAULT_SETTINGS,
	SETTINGS_STORAGE_KEY
} from "@/libs/constants/screens/settings"
import { useUserSettings } from "@/libs/query/hooks/use-user-settings"
import {
	getQueuedSettingsChanges,
	readSettings,
	settingsFromResponse,
	settingsToPatch,
	writeSettings
} from "@/libs/utils/screens/settings"
import type {
	NotificationKey,
	SettingsState,
	SettingsUpdate
} from "@/types/screens/settings"

export const useSettingsProvider = () => {
	const systemReducedMotion = useReducedMotion()

	const { setTheme, resolvedTheme } = useTheme()

	const [settings, setSettings] = useState<SettingsState>(DEFAULT_SETTINGS)

	const [hydrated, setHydrated] = useState<boolean>(false)
	const [pendingOfflineChanges, setPendingOfflineChanges] =
		useState<boolean>(false)

	const {
		data: remoteSettings,
		isFetching,
		updateSettings: syncSettings
	} = useUserSettings()

	const hydratedRef = useRef(hydrated)
	hydratedRef.current = hydrated

	const applyPatch = useCallback((patch: Partial<SettingsState>) => {
		setSettings(current => ({
			...current,
			...patch,
			notifications: { ...current.notifications, ...patch.notifications }
		}))
	}, [])

	const updateSettings = useCallback(
		(patch: Partial<SettingsUpdate>) => {
			applyPatch(patch)

			void syncSettings(settingsToPatch(patch))
		},
		[applyPatch, syncSettings]
	)

	const updateNotification = useCallback(
		(key: NotificationKey, value: boolean) => {
			setSettings(current => ({
				...current,
				notifications: { ...current.notifications, [key]: value }
			}))

			void syncSettings({ notifications: { [key]: value } })
		},
		[syncSettings]
	)

	const reduceMotion = useMemo(() => {
		switch (settings.animations) {
			case "disabled":
				return true
			case "enabled":
				return false
			default:
				return Boolean(systemReducedMotion)
		}
	}, [settings.animations, systemReducedMotion])

	const contextValue = useMemo(
		() => ({
			settings,
			hydrated,
			syncing: isFetching,
			pendingOfflineChanges,
			updateSettings,
			updateNotification
		}),
		[
			settings,
			hydrated,
			isFetching,
			pendingOfflineChanges,
			updateSettings,
			updateNotification
		]
	)

	// Phase 1: Hydrate from localStorage on mount
	useEffect(() => {
		setSettings(readSettings())
		setHydrated(true)
	}, [])

	// Phase 2: Sync with remote settings after hydration
	useEffect(() => {
		if (!hydrated || !remoteSettings) return

		void getQueuedSettingsChanges().then(queued => {
			if (queued) {
				setPendingOfflineChanges(true)
				return
			}

			setSettings(settingsFromResponse(remoteSettings))
			setPendingOfflineChanges(false)
		})
	}, [hydrated, remoteSettings])

	// Phase 3: Apply settings to DOM after hydration
	useEffect(() => {
		if (!hydratedRef.current) return

		writeSettings(settings)
		setTheme(settings.theme)

		const root = document.documentElement
		const theme = resolvedTheme === "dark" ? "dark" : "light"
		const accent = ACCENT_COLORS[settings.accent][theme]

		// Batch all CSS variable updates into a single style assignment
		root.style.cssText = [
			`--primary:${accent.primary}`,
			`--on-primary:${accent.onPrimary}`,
			`--primary-container:${accent.primaryContainer}`,
			`--on-primary-container:${accent.onPrimaryContainer}`,
			`--secondary:${accent.secondary}`,
			`--on-secondary:${accent.onSecondary}`,
			`--secondary-container:${accent.secondaryContainer}`,
			`--on-secondary-container:${accent.onSecondaryContainer}`
		].join(";")

		root.dataset.accent = settings.accent
		root.dataset.density = settings.density
		root.dataset.motion = settings.animations
		root.dataset.textSize = settings.textSize
	}, [settings, setTheme, resolvedTheme])

	// Cross-tab synchronization
	useEffect(() => {
		const handleStorage = (event: StorageEvent) => {
			if (event.key !== SETTINGS_STORAGE_KEY && event.key !== null) return

			setSettings(readSettings())
		}

		window.addEventListener("storage", handleStorage)

		return () => window.removeEventListener("storage", handleStorage)
	}, [])

	return { contextValue, reduceMotion }
}
