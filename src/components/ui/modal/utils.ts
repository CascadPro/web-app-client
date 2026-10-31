import { DURATION, EASE_OUT, SPRING } from "@/libs/motion"

const FOCUSABLE_SELECTOR = [
	"a[href]",
	"button:not([disabled])",
	"textarea:not([disabled])",
	"input:not([disabled])",
	"select:not([disabled])",
	"[tabindex]:not([tabindex='-1'])"
].join(",")

export function getFocusableElements(container: HTMLElement): HTMLElement[] {
	return Array.from(
		container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
	).filter(
		element =>
			!element.hasAttribute("disabled") &&
			element.getAttribute("aria-hidden") !== "true" &&
			element.offsetParent !== null
	)
}

export const MODAL_SPRING = SPRING.modal

export const BACKDROP_TRANSITION = {
	duration: DURATION.base,
	ease: EASE_OUT
}

export const getModalTransition = (reducedMotion: boolean) =>
	reducedMotion ? { duration: 0 } : MODAL_SPRING

export const getBackdropTransition = (reducedMotion: boolean) =>
	reducedMotion ? { duration: 0 } : BACKDROP_TRANSITION
