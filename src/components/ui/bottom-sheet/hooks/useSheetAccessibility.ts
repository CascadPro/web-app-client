import { type RefObject, useEffect } from "react"

interface Options {
	open: boolean
	panelRef: RefObject<HTMLDivElement | null>
	closeOnEscape: boolean
	onClose: () => void
}

const FOCUSABLE_SELECTOR = [
	"a[href]",
	"button:not([disabled])",
	"input:not([disabled])",
	"select:not([disabled])",
	"textarea:not([disabled])",
	'[tabindex]:not([tabindex="-1"])'
].join(",")

export const useBottomSheetAccessibility = ({
	open,
	panelRef,
	closeOnEscape,
	onClose
}: Options) => {
	useEffect(() => {
		if (!open) return

		const panel = panelRef.current
		if (!panel) return

		const previousFocus =
			document.activeElement instanceof HTMLElement
				? document.activeElement
				: null

		panel.focus({ preventScroll: true })

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape" && closeOnEscape) {
				event.preventDefault()
				onClose()
				return
			}

			if (event.key !== "Tab") return

			const focusable = Array.from(
				panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
			).filter(
				element =>
					!element.hasAttribute("disabled") &&
					element.getAttribute("aria-hidden") !== "true" &&
					element.tabIndex !== -1
			)

			const first = focusable[0]
			const last = focusable.at(-1)

			if (!first || !last) {
				event.preventDefault()
				panel.focus()
				return
			}

			if (event.shiftKey && document.activeElement === first) {
				event.preventDefault()
				last.focus()
			} else if (!event.shiftKey && document.activeElement === last) {
				event.preventDefault()
				first.focus()
			}
		}

		document.addEventListener("keydown", handleKeyDown)

		return () => {
			document.removeEventListener("keydown", handleKeyDown)

			if (previousFocus?.isConnected) {
				previousFocus.focus({ preventScroll: true })
			}
		}
	}, [open, panelRef, closeOnEscape, onClose])
}
