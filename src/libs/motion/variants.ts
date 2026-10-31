import type { Transition, Variants } from "motion/react"

import { DESIGN } from "@/libs/design/config"

/**
 * Все значения берутся из единого конфига (src/libs/design/config.ts).
 * Анимируем только transform и opacity — они не вызывают layout/paint.
 */

export type Bezier = [number, number, number, number]

export const EASE_OUT: Bezier = DESIGN.motion.ease.out
export const EASE_IN_OUT: Bezier = DESIGN.motion.ease.inOut
export const EASE_EMPHASIZED: Bezier = DESIGN.motion.ease.emphasized

export const DURATION = DESIGN.motion.duration

export const SPRING = DESIGN.motion.spring satisfies Record<string, Transition>
export const SPRING_SOFT: Transition = SPRING.soft

export const MAX_STAGGER_ITEMS = DESIGN.motion.stagger.max

/** Мгновенный переход — для reduced motion */
export const INSTANT: Transition = { duration: 0 }

export const fadeUp: Variants = {
	hidden: { opacity: 0, y: 12 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: DURATION.slow, ease: EASE_OUT }
	}
}

export const fadeIn: Variants = {
	hidden: { opacity: 0 },
	visible: { opacity: 1, transition: { duration: DURATION.base } }
}

export const scaleIn: Variants = {
	hidden: { opacity: 0, scale: 0.96 },
	visible: {
		opacity: 1,
		scale: 1,
		transition: { duration: DURATION.base, ease: EASE_OUT }
	}
}

/** Варианты stagger кэшируются: одинаковые параметры → один и тот же объект (нет лишних ре-рендеров) */
const staggerCache = new Map<string, Variants>()

export const createStagger = (
	stagger: number = DESIGN.motion.stagger.step,
	delay = 0
): Variants => {
	const key = `${stagger}:${delay}`
	const cached = staggerCache.get(key)

	if (cached) return cached

	const variants: Variants = {
		hidden: {},
		visible: { transition: { staggerChildren: stagger, delayChildren: delay } }
	}

	staggerCache.set(key, variants)

	return variants
}
