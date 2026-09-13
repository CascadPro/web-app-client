"use client"

import { useCallback } from "react"

import { haptic, preloadHaptic } from "./haptic"

export const useHaptic = () => {
	const trigger = useCallback(
		(type: Parameters<typeof haptic>[0] = "light") => {
			haptic(type)
		},
		[]
	)

	const preload = useCallback(() => {
		preloadHaptic()
	}, [])

	return {
		haptic: trigger,
		preloadHaptic: preload
	}
}
