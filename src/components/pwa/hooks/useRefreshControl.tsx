import {
	MotionValue,
	useMotionValue,
	useSpring,
	useTransform
} from "motion/react"
import { useCallback, useEffect, useRef, useState } from "react"

export const useRefreshControlValues = (
	pull: MotionValue<number>,
	threshold: number,
	maxPull: number
) => {
	const springPull = useSpring(pull, {
		stiffness: 500,
		damping: 35,
		mass: 0.35
	})

	const progress = useTransform(springPull, [0, threshold], [0, 1])

	const indicatorScale = useTransform(
		springPull,
		[0, threshold * 0.35, threshold],
		[0.65, 0.9, 1]
	)

	const indicatorOpacity = useTransform(
		springPull,
		[0, 20, threshold * 0.7],
		[0, 0.6, 1]
	)

	const indicatorY = useTransform(springPull, [0, maxPull], [0, maxPull * 0.75])

	const indicatorRotate = useTransform(springPull, [0, threshold], [-90, 180])

	return {
		progress,
		indicatorScale,
		indicatorOpacity,
		indicatorY,
		indicatorRotate
	}
}

export const useRefreshControl = (
	threshold: number,
	fn: () => Promise<void> | void
) => {
	const [maxPull, setMaxPull] = useState(0)
	const [isRefreshing, setIsRefreshing] = useState(false)
	const [isPulling, setIsPulling] = useState(false)

	const startY = useRef<number | null>(null)
	const currentPull = useRef(0)
	const refreshingRef = useRef(false)

	const fnRef = useRef(fn)
	fnRef.current = fn

	const pull = useMotionValue(0)

	useEffect(() => {
		const updateMaxPull = () => {
			setMaxPull(window.innerHeight / 6)
		}

		updateMaxPull()

		window.addEventListener("resize", updateMaxPull)

		return () => {
			window.removeEventListener("resize", updateMaxPull)
		}
	}, [])

	const reset = useCallback(() => {
		startY.current = null
		currentPull.current = 0
		setIsPulling(false)
		pull.set(0)
	}, [pull])

	useEffect(() => {
		const handleTouchStart = (event: TouchEvent) => {
			if (refreshingRef.current || window.scrollY > 0) {
				return
			}

			if (document.body.classList.contains("scroll-locked")) {
				return
			}

			startY.current = event.touches[0].clientY
			currentPull.current = 0

			setIsPulling(false)
		}

		const handleTouchMove = (event: TouchEvent) => {
			if (startY.current === null || refreshingRef.current || maxPull === 0) {
				return
			}

			if (window.scrollY > 0) {
				reset()
				return
			}

			const diff = event.touches[0].clientY - startY.current

			if (diff <= 0) {
				pull.set(0)
				setIsPulling(false)
				return
			}

			const nextPull = Math.min(diff * 0.55, maxPull)

			currentPull.current = nextPull

			pull.set(nextPull)
			setIsPulling(true)

			event.preventDefault()
		}

		const handleTouchEnd = async () => {
			if (startY.current === null || refreshingRef.current) {
				return
			}

			startY.current = null

			const shouldRefresh = currentPull.current >= threshold

			setIsPulling(false)

			if (!shouldRefresh) {
				currentPull.current = 0
				pull.set(0)
				return
			}

			refreshingRef.current = true
			setIsRefreshing(true)

			pull.set(threshold)

			try {
				await fnRef.current()
			} finally {
				refreshingRef.current = false
				setIsRefreshing(false)

				currentPull.current = 0
				pull.set(0)
			}
		}

		document.addEventListener("touchstart", handleTouchStart, { passive: true })
		document.addEventListener("touchmove", handleTouchMove, { passive: false })
		document.addEventListener("touchend", handleTouchEnd, { passive: true })

		return () => {
			document.removeEventListener("touchstart", handleTouchStart)
			document.removeEventListener("touchmove", handleTouchMove)
			document.removeEventListener("touchend", handleTouchEnd)
		}
	}, [maxPull, pull, reset, threshold])

	return {
		pull,
		maxPull,
		currentPull,
		isRefreshing,
		isPulling
	}
}
