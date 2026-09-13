import { type FocusEvent, useEffect, useRef } from "react"

import { getFocusableElements } from "../utils"

export const useModalContent = (
	onFocus: ((event: FocusEvent<HTMLDivElement>) => void) | undefined
) => {
	const contentRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const content = contentRef.current

		if (!content) return

		const focusable = getFocusableElements(content)

		if (focusable.length > 0) {
			focusable[0].focus()
		} else {
			content.focus()
		}
	}, [])

	useEffect(() => {
		const content = contentRef.current

		if (!content) return

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key !== "Tab") return

			const focusable = getFocusableElements(content)

			if (focusable.length === 0) {
				event.preventDefault()
				content.focus()
				return
			}

			const first = focusable[0]
			const last = focusable[focusable.length - 1]

			if (event.shiftKey) {
				if (
					document.activeElement === first ||
					!content.contains(document.activeElement)
				) {
					event.preventDefault()
					last.focus()
				}
			} else {
				if (
					document.activeElement === last ||
					!content.contains(document.activeElement)
				) {
					event.preventDefault()
					first.focus()
				}
			}
		}

		content.addEventListener("keydown", handleKeyDown)

		return () => {
			content.removeEventListener("keydown", handleKeyDown)
		}
	}, [])

	const handleFocus = (event: FocusEvent<HTMLDivElement>) => {
		onFocus?.(event)
	}

	return {
		contentRef,
		handleFocus
	}
}
