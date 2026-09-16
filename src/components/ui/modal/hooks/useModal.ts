import { useCallback, useEffect, useRef } from "react"

import { useScrollLocked } from "@/libs/hooks"

export const useModal = (
	isOpen: boolean,
	onOpenChange: (open: boolean) => void
) => {
	const previousActiveElement = useRef<HTMLElement | null>(null)

	const handleClose = useCallback(() => {
		onOpenChange(false)
	}, [onOpenChange])

	useEffect(() => {
		if (!isOpen) return

		previousActiveElement.current =
			document.activeElement instanceof HTMLElement
				? document.activeElement
				: null

		const originalPaddingRight = document.body.style.paddingRight

		const scrollbarWidth =
			window.innerWidth - document.documentElement.clientWidth

		if (scrollbarWidth > 0) {
			document.body.style.paddingRight = `${scrollbarWidth}px`
		}

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				event.preventDefault()
				handleClose()
			}
		}

		document.addEventListener("keydown", handleKeyDown)

		return () => {
			document.body.style.paddingRight = originalPaddingRight

			document.removeEventListener("keydown", handleKeyDown)

			requestAnimationFrame(() => {
				previousActiveElement.current?.focus()
				previousActiveElement.current = null
			})
		}
	}, [isOpen, handleClose])

	useScrollLocked(isOpen)

	return {
		handleClose
	}
}
