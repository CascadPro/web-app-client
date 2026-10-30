import type { Transition, Variants } from "motion/react"

export type Bezier = [number, number, number, number]

export const EASE_OUT: Bezier = [0.22, 1, 0.36, 1]

export const DURATION = {
	fast: 0.15,
	base: 0.22,
	slow: 0.35
} as const

/** Анимируем только transform и opacity — они не вызывают layout/paint. */
export const SPRING_SOFT: Transition = {
	type: "spring",
	stiffness: 380,
	damping: 30,
	mass: 0.8
}

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

export const createStagger = (stagger = 0.05, delay = 0): Variants => ({
	hidden: {},
	visible: { transition: { staggerChildren: stagger, delayChildren: delay } }
})
