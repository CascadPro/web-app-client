"use client"

import { useEffect } from "react"

import { getCssVar } from "@/libs/utils"

function updatePWATheme() {
	const background = getCssVar("--background")

	if (!background) return

	document.documentElement.style.setProperty(
		"--pwa-background-color",
		background
	)
}

export function PWAProvider() {
	useEffect(() => {
		updatePWATheme()

		const observer = new MutationObserver(() => {
			updatePWATheme()
		})

		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["class", "data-theme"]
		})

		return () => {
			observer.disconnect()
		}
	}, [])

	return null
}
