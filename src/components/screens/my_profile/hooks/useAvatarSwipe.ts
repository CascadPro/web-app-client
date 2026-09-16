import { useEffect, useRef, useState } from "react"

export const useAvatarSwipe = (open: boolean, onSwipeAction: () => void) => {
	const startX = useRef(0)
	const startY = useRef(0)

	const [translate, setTranslate] = useState(0)

	useEffect(() => {
		if (!open) return

		const handleTouchStart = (event: TouchEvent) => {
			const touch = event.touches[0]

			startX.current = touch.clientX
			startY.current = touch.clientY
		}

		const handleTouchEnd = (event: TouchEvent) => {
			const touch = event.changedTouches[0]

			const deltaX = touch.clientX - startX.current
			const deltaY = touch.clientY - startY.current

			if (Math.abs(deltaX) >= Math.abs(deltaY)) return

			const swipeThreshold = window.innerHeight * 0.25
			const isSwipe = Math.abs(deltaY) >= swipeThreshold

			setTranslate(0)

			if (!isSwipe) return

			onSwipeAction()
		}

		const handleTouchMove = (event: TouchEvent) => {
			const touch = event.touches[0]
			const deltaY = touch.clientY - startY.current
			const deltaX = touch.clientX - startX.current

			if (Math.abs(deltaX) >= Math.abs(deltaY)) {
				return
			}

			setTranslate(Math.floor((deltaY / window.innerHeight) * 100))
		}

		document.addEventListener("touchstart", handleTouchStart)
		document.addEventListener("touchend", handleTouchEnd)
		document.addEventListener("touchmove", handleTouchMove)

		return () => {
			document.removeEventListener("touchstart", handleTouchStart)
			document.removeEventListener("touchend", handleTouchEnd)
			document.removeEventListener("touchmove", handleTouchMove)
		}
	}, [open, onSwipeAction])

	return translate
}
