"use client"

import { AnimatePresence } from "motion/react"

import { useSettingsContext } from "@/components/providers/settings-provider"

import { SettingsAdvanced } from "./components/sections/settings-advanced"
import { SettingsAppearance } from "./components/sections/settings-appearance"
import { SettingsApplication } from "./components/sections/settings-application"
import { SettingsNotifications } from "./components/sections/settings-notifications"
import { useSettingsCache } from "./hooks/useSettingsCache"

export const SettingsScreen = () => {
	const { settings, hydrated, updateSettings, updateNotification } =
		useSettingsContext()

	const { totalCacheSize, isCacheMeasuring, clearing, clearCache } =
		useSettingsCache()

	return (
		<div className="mx-auto w-full max-w-4xl space-y-(--section-gap) px-1 sm:px-6">
			<AnimatePresence mode="wait">
				{hydrated && (
					<>
						<SettingsAppearance settings={settings} onChange={updateSettings} />

						<SettingsAdvanced settings={settings} onChange={updateSettings} />

						<SettingsNotifications
							settings={settings.notifications}
							onChange={updateNotification}
						/>

						<SettingsApplication
							totalCacheSize={totalCacheSize}
							isCacheMeasuring={isCacheMeasuring}
							clearing={clearing}
							onClearCache={clearCache}
						/>
					</>
				)}
			</AnimatePresence>
		</div>
	)
}
