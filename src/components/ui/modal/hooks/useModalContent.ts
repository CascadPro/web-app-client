import { type FocusEvent, useCallback, useEffect, useRef } from "react"

import { getFocusableElements } from "../utils"

export const useModalContent = (
	onFocus?: (event: FocusEvent<HTMLDivElement>) => void
) => {
	const contentRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const content = contentRef.current
		if (!content) return

		const focusFirstElement = () => {
			const focusable = getFocusableElements(content)
			const target = focusable[0] ?? content

			target.focus({ preventScroll: true })
		}

		// Дать браузеру завершить вставку содержимого перед фокусировкой.
		focusFirstElement()
	}, [])

	useEffect(() => {
		const content = contentRef.current
		if (!content) return

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key !== "Tab") return

			const focusable = getFocusableElements(content)
			const first = focusable[0]
			const last = focusable.at(-1)

			if (!first || !last) {
				event.preventDefault()
				content.focus()
				return
			}

			const activeElement = document.activeElement
			const focusIsOutside = !content.contains(activeElement)

			if (event.shiftKey) {
				if (activeElement === first || focusIsOutside) {
					event.preventDefault()
					last.focus()
				}
			} else if (activeElement === last || focusIsOutside) {
				event.preventDefault()
				first.focus()
			}
		}

		content.addEventListener("keydown", handleKeyDown)

		return () => {
			content.removeEventListener("keydown", handleKeyDown)
		}
	}, [])

	const handleFocus = useCallback(
		(event: FocusEvent<HTMLDivElement>) => {
			onFocus?.(event)
		},
		[onFocus]
	)

	return {
		contentRef,
		handleFocus
	}
}
