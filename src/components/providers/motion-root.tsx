"use client"

import { MotionConfig } from "motion/react"
import { type FC, type PropsWithChildren, useEffect, useState } from "react"

import { MotionPreferenceProvider } from "@/libs/motion"
import { readSettings } from "@/libs/utils/screens/settings"
import type { AnimationPreference } from "@/types/screens/settings"

const toOverride = (value: AnimationPreference | undefined) => {
	if (value === "disabled") return true
	if (value === "enabled") return false

	return null
}

/**
 * Корневой провайдер настройки анимаций. В отличие от SettingsContextProvider
 * (он только в защищённой части) работает везде: на публичных страницах,
 * в тостах и в сплеш-экране.
 *
 * Источник правды — data-motion на <html>: его выставляет SettingsContextProvider,
 * а на публичных страницах мы берём значение из localStorage.
 */
export const MotionRoot: FC<PropsWithChildren> = ({ children }) => {
	const [override, setOverride] = useState<boolean | null>(null)

	useEffect(() => {
		const root = document.documentElement

		if (!root.dataset.motion) {
			root.dataset.motion = readSettings().animations
		}

		const sync = () =>
			setOverride(toOverride(root.dataset.motion as AnimationPreference))

		sync()

		const observer = new MutationObserver(sync)
		observer.observe(root, {
			attributes: true,
			attributeFilter: ["data-motion"]
		})

		return () => observer.disconnect()
	}, [])

	return (
		<MotionPreferenceProvider value={override}>
			<MotionConfig
				reducedMotion={
					override === null ? "user" : override ? "always" : "never"
				}
			>
				{children}
			</MotionConfig>
		</MotionPreferenceProvider>
	)
}
