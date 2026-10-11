export const SHEET_SPRING = {
	type: "spring" as const,
	damping: 32,
	stiffness: 320,
	mass: 0.8
}

export const BACKDROP_TRANSITION = {
	duration: 0.2,
	ease: "easeOut" as const
}

export const getSheetTransition = (reducedMotion: boolean) =>
	reducedMotion ? { duration: 0 } : SHEET_SPRING

export const getBackdropTransition = (reducedMotion: boolean) =>
	reducedMotion ? { duration: 0 } : BACKDROP_TRANSITION
