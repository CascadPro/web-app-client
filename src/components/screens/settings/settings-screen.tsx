"use client"

import { AnimatePresence } from "motion/react"

import { useSettingsContext } from "@/components/providers/settings-provider"

export const SettingsScreen = () => {
	const { settings, hydrated, updateSettings, updateNotification } =
		useSettingsContext()

	return (
		<div className="mx-auto w-full max-w-4xl space-y-(--section-gap) px-1 sm:px-6">
			<AnimatePresence mode="wait">
			</AnimatePresence>
		</div>
	)
}
