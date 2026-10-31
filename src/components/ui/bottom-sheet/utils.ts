import { DURATION, EASE_OUT, SPRING } from "@/libs/motion"

export const SHEET_SPRING = SPRING.sheet

export const BACKDROP_TRANSITION = {
	duration: DURATION.base,
	ease: EASE_OUT
}

export const getSheetTransition = (reducedMotion: boolean) =>
	reducedMotion ? { duration: 0 } : SHEET_SPRING

export const getBackdropTransition = (reducedMotion: boolean) =>
	reducedMotion ? { duration: 0 } : BACKDROP_TRANSITION
