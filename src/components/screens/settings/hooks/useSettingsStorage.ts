"use client"

import { useCallback, useEffect, useState } from "react"

import { DEFAULT_SETTINGS } from "@/libs/constants/screens/settings"
import { readSettings, writeSettings } from "@/libs/utils/screens/settings"
import {
	NotificationKey,
	SettingsState,
	SettingsUpdate
} from "@/types/screens/settings"

export const useSettingsStorage = () => {
	const [settings, setSettings] = useState<SettingsState>(DEFAULT_SETTINGS)
	const [hydrated, setHydrated] = useState(false)

	useEffect(() => {
		setSettings(readSettings())
		setHydrated(true)
	}, [])

	useEffect(() => {
		if (hydrated) writeSettings(settings)
	}, [settings, hydrated])

	const updateSettings = useCallback((patch: Partial<SettingsUpdate>) => {
		setSettings(current => ({ ...current, ...patch }))
	}, [])

	const updateNotification = useCallback(
		(key: NotificationKey, value: boolean) => {
			setSettings(current => ({
				...current,
				notifications: {
					...current.notifications,
					[key]: value
				}
			}))
		},
		[]
	)

	return {
		settings,
		hydrated,
		updateSettings,
		updateNotification
	}
}
