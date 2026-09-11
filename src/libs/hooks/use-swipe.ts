"use client"

import { useEffect, useRef } from "react"

export type UseSwipeOptions = {
	onSwipeLeft?: VoidFunction
	onSwipeRight?: VoidFunction

	/**
	 * Minimum swipe distance as a fraction of viewport width.
	 * 0.5 = 50% of screen.
	 */
	threshold?: number

	/**
	 * Maximum distance from screen edge where swipe can start.
	 * 32 = 32px.
	 */
	edgeThreshold?: number

	/**
	 * Whether swipe right must start from the left edge.
	 */
	rightFromEdge?: boolean

	/**
	 * Whether swipe left must start from the right edge.
	 */
	leftFromEdge?: boolean
}

export const useSwipe = ({
	onSwipeLeft,
	onSwipeRight,
	threshold = 0.5,
	edgeThreshold = 32,
	rightFromEdge = true,
	leftFromEdge = true
}: UseSwipeOptions = {}) => {
	const startX = useRef(0)
	const startY = useRef(0)

	useEffect(() => {
		const handleTouchStart = (event: TouchEvent) => {
			const touch = event.touches[0]

			startX.current = touch.clientX
			startY.current = touch.clientY
		}

		const handleTouchEnd = (event: TouchEvent) => {
			const touch = event.changedTouches[0]

			const deltaX = touch.clientX - startX.current
			const deltaY = touch.clientY - startY.current

			// Ignore vertical / diagonal gestures
			if (Math.abs(deltaX) <= Math.abs(deltaY)) {
				return
			}

			const swipeThreshold = window.innerWidth * threshold
			const isSwipe = Math.abs(deltaX) >= swipeThreshold

			if (!isSwipe) {
				return
			}

			const startedFromLeftEdge = startX.current <= edgeThreshold

			const startedFromRightEdge =
				startX.current >= window.innerWidth - edgeThreshold

			// Swipe right
			if (deltaX > 0 && (!rightFromEdge || startedFromLeftEdge)) {
				onSwipeRight?.()
				return
			}

			// Swipe left
			if (deltaX < 0 && (!leftFromEdge || startedFromRightEdge)) {
				onSwipeLeft?.()
			}
		}

		document.addEventListener("touchstart", handleTouchStart)
		document.addEventListener("touchend", handleTouchEnd)

		return () => {
			document.removeEventListener("touchstart", handleTouchStart)

			document.removeEventListener("touchend", handleTouchEnd)
		}
	}, [
		edgeThreshold,
		leftFromEdge,
		onSwipeLeft,
		onSwipeRight,
		rightFromEdge,
		threshold
	])
}
