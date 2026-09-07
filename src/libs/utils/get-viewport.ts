import type { Viewport } from "next"

export const getViewport = (scalable: boolean, initial: number): Viewport => ({
	initialScale: initial,
	maximumScale: 1,
	minimumScale: 1,
	userScalable: scalable
})
