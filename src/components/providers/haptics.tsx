"use client"

import { useEffect } from "react"

import { preloadHaptic } from "@/libs/haptics"

export function HapticProvider() {
	useEffect(() => {
		const handlePointerDown = () => {
			preloadHaptic()

			window.removeEventListener("pointerdown", handlePointerDown)
		}

		window.addEventListener("pointerdown", handlePointerDown, {
			once: true
		})

		return () => {
			window.removeEventListener("pointerdown", handlePointerDown)
		}
	}, [])

	return null
}
