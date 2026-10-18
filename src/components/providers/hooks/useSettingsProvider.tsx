"use client"

import { useReducedMotion } from "motion/react"
import { useTheme } from "next-themes"
import { useEffect, useMemo, useState } from "react"

import {
	ACCENT_COLORS,
	DEFAULT_SETTINGS
} from "@/libs/constants/screens/settings"
import { readSettings, writeSettings } from "@/libs/utils/screens/settings"
import type {
	NotificationKey,
	SettingsState,
	SettingsUpdate
} from "@/types/screens/settings"

export const useSettingsProvider = () => {
	const systemReducedMotion = useReducedMotion()

	const [settings, setSettings] = useState<SettingsState>(DEFAULT_SETTINGS)
	const [hydrated, setHydrated] = useState<boolean>(false)

	const { setTheme } = useTheme()

	const updateSettings = (patch: Partial<SettingsUpdate>) => {
		setSettings(current => ({ ...current, ...patch }))
	}

	const updateNotification = (key: NotificationKey, value: boolean) => {
		setSettings(current => ({
			...current,
			notifications: {
				...current.notifications,
				[key]: value
			}
		}))
	}

	const contextValue = useMemo(
		() => ({
			settings,
			hydrated,
			updateSettings,
			updateNotification
		}),
		[settings, hydrated, updateSettings, updateNotification]
	)

	const reduceMotion = useMemo(() => {
		if (settings.animations === "disabled") {
			return true
		} else if (settings.animations === "enabled") {
			return false
		} else {
			return !!systemReducedMotion
		}
	}, [settings.animations, systemReducedMotion])

	useEffect(() => {
		setSettings(readSettings())
		setHydrated(true)
	}, [])

	useEffect(() => {
		if (!hydrated) return

		writeSettings(settings)
		setTheme(settings.theme)

		const root = document.documentElement
		const accent = ACCENT_COLORS[settings.accent]

		root.dataset.accent = settings.accent
		root.dataset.density = settings.density
		root.dataset.motion = settings.animations

		root.style.setProperty("--primary", accent.primary)
		root.style.setProperty("--primary-container", accent.container)
		root.style.setProperty("--on-primary", accent.onPrimary)
	}, [settings, hydrated, setTheme])

	return {
		contextValue,
		reduceMotion
	}
}
