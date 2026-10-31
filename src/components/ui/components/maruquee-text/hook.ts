import { type Easing, useAnimationControls, useInView } from "motion/react"
import { useCallback, useEffect, useRef, useState } from "react"

import { EASE_OUT, useReduceMotion } from "@/libs/motion"

import type { MarqueeTextOptions } from "./types"

const ease: Easing = EASE_OUT

export const useMarqueeText = ({
	speed = 0.2,
	backDuration = 0.45,
	startDelay = 3,
	resetDelay = 1,
	infinite = true
}: MarqueeTextOptions) => {
	const containerRef = useRef<HTMLDivElement>(null)
	const textRef = useRef<HTMLHeadingElement>(null)

	const controls = useAnimationControls()
	const isInView = useInView(containerRef, { amount: 0.6 })

	const shouldReduceMotion = useReduceMotion()

	const [distance, setDistance] = useState(0)
	const [isMobile, setIsMobile] = useState(false)

	const measure = useCallback(() => {
		const container = containerRef.current
		const text = textRef.current

		if (!container || !text) return

		setDistance(Math.max(0, text.scrollWidth - container.clientWidth))
	}, [])

	useEffect(() => {
		const mediaQuery = window.matchMedia("(hover: none)")

		const updateDevice = () => {
			setIsMobile(mediaQuery.matches)
		}

		updateDevice()
		mediaQuery.addEventListener("change", updateDevice)

		const observer = new ResizeObserver(measure)

		if (containerRef.current) {
			observer.observe(containerRef.current)
		}

		if (textRef.current) {
			observer.observe(textRef.current)
		}

		measure()

		return () => {
			mediaQuery.removeEventListener("change", updateDevice)
			observer.disconnect()
		}
	}, [measure])

	const startAnimation = useCallback(async () => {
		if (distance <= 0 || shouldReduceMotion) return

		await controls.start({
			x: -distance,
			transition: { duration: distance / (speed * 100), ease: "linear" }
		})

		await controls.start({
			x: 0,
			transition: { duration: backDuration, ease, delay: resetDelay }
		})
	}, [controls, distance, shouldReduceMotion])

	useEffect(() => {
		controls.stop()
		controls.set({ x: 0 })

		if (isMobile && isInView && distance > 0) {
			const time =
				startDelay * 1000 +
				resetDelay * 1000 +
				Math.ceil(distance / (speed * 100)) * 1000

			if (infinite) {
				const interval = window.setInterval(startAnimation, time)

				return () => window.clearInterval(interval)
			} else {
				const timeout = window.setTimeout(startAnimation, time)

				return () => window.clearTimeout(timeout)
			}
		}
	}, [controls, distance, isInView, isMobile, startAnimation])

	const handleMouseEnter = () => {
		if (!isMobile) void startAnimation()
	}

	const handleMouseLeave = () => {
		if (!isMobile) {
			controls.stop()

			void controls.start({
				x: 0,
				transition: { duration: backDuration, ease, delay: resetDelay }
			})
		}
	}

	return {
		containerRef,
		handleMouseEnter,
		handleMouseLeave,
		textRef,
		controls
	}
}
