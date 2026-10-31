import type { MotionValue } from "motion/react"
import { animate, useMotionValue, useTransform } from "motion/react"
import type { RefObject } from "react"
import { useCallback, useLayoutEffect, useRef, useState } from "react"

import { SPRING, useReduceMotion } from "@/libs/motion"

const LEADING = SPRING.segmented
const TRAILING = SPRING.segmentedTrail

interface UseSegmentedControlReturn {
	containerRef: RefObject<HTMLFieldSetElement | null>
	left: MotionValue<number>
	top: MotionValue<number>
	width: MotionValue<number>
	height: MotionValue<number>
	ready: boolean
	itemRefs: RefObject<Map<unknown, HTMLButtonElement>>
}

export const useSegmentedControl = <T>(
	value: T,
	options: unknown[]
): UseSegmentedControlReturn => {
	const reduceMotion = useReduceMotion()

	const containerRef = useRef<HTMLFieldSetElement>(null)
	const itemRefs = useRef(new Map<T, HTMLButtonElement>())

	const initialized = useRef<boolean>(false)
	const [ready, setReady] = useState<boolean>(false)

	const left = useMotionValue(0)
	const right = useMotionValue(0)
	const top = useMotionValue(0)
	const bottom = useMotionValue(0)

	const width = useTransform([left, right], ([l, r]: number[]) =>
		Math.max(r - l, 0)
	)
	const height = useTransform([top, bottom], ([t, b]: number[]) =>
		Math.max(b - t, 0)
	)

	const measure = useCallback(() => {
		const el = itemRefs.current.get(value)
		if (!el) return null

		return {
			l: el.offsetLeft,
			r: el.offsetLeft + el.offsetWidth,
			t: el.offsetTop,
			b: el.offsetTop + el.offsetHeight
		}
	}, [value])

	const jump = useCallback(
		(next: NonNullable<ReturnType<typeof measure>>) => {
			left.set(next.l)
			right.set(next.r)
			top.set(next.t)
			bottom.set(next.b)
		},
		[left, right, top, bottom]
	)

	useLayoutEffect(() => {
		const next = measure()
		if (!next) return

		if (!initialized.current || reduceMotion) {
			jump(next)
			initialized.current = true
			setReady(true)
			return
		}

		const dy = next.t - top.get()
		const movingForward = Math.abs(dy) > 1 ? dy > 0 : next.l > left.get()

		animate(left, next.l, movingForward ? TRAILING : LEADING)
		animate(right, next.r, movingForward ? LEADING : TRAILING)
		animate(top, next.t, movingForward ? TRAILING : LEADING)
		animate(bottom, next.b, movingForward ? LEADING : TRAILING)
	}, [value, options, measure, jump, left, right, top, bottom, reduceMotion])

	useLayoutEffect(() => {
		const container = containerRef.current
		if (!container) return

		const observer = new ResizeObserver(() => {
			const next = measure()
			if (next) jump(next)
		})
		observer.observe(container)

		return () => observer.disconnect()
	}, [measure, jump])

	return {
		containerRef,
		left,
		top,
		width,
		height,
		ready,
		itemRefs
	}
}
