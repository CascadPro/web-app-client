"use client"

import { useEffect } from "react"

function getCSSVariable(name: string) {
	return getComputedStyle(document.documentElement)
		.getPropertyValue(name)
		.trim()
}

function updatePWATheme() {
	const background = getCSSVariable("--background")
	// const primary = getCSSVariable("--primary")

	if (!background) return

	let meta = document.querySelector('meta[name="theme-color"]')

	if (!meta) {
		meta = document.createElement("meta")

		meta.setAttribute("name", "theme-color")

		document.head.appendChild(meta)
	}

	meta.setAttribute("content", background)

	document.documentElement.style.setProperty(
		"--pwa-background-color",
		background
	)
}

export function PWAProvider() {
	useEffect(() => {
		if ("serviceWorker" in navigator) {
			navigator.serviceWorker.register("/sw.js")
		}

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
