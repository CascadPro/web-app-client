import { useReducedMotion } from "motion/react"
import { useCallback, useEffect, useState } from "react"

import { toast } from "../toast"
import { ToastData } from "../types"

export const useToastItem = (item: ToastData) => {
	const reduceMotion = useReducedMotion()

	const [remaining, setRemaining] = useState(item.duration ?? 0)
	const [paused, setPaused] = useState(false)

	const duration = item.duration ?? 0

	useEffect(() => {
		setRemaining(duration)
		setPaused(false)
	}, [item.id, duration])

	useEffect(() => {
		if (duration <= 0 || paused) return

		const startedAt = Date.now()
		const timeout = window.setTimeout(() => toast.dismiss(item.id), remaining)

		return () => {
			window.clearTimeout(timeout)

			setRemaining(current => Math.max(0, current - (Date.now() - startedAt)))
		}
	}, [item.id, remaining, paused])

	const handleClose = useCallback(() => {
		toast.dismiss(item.id)
	}, [item.id])

	const handleClick = () => {
		item.onClick?.()
		handleClose()
	}

	return {
		reduceMotion,
		remaining,
		paused,
		setPaused,
		handleClick,
		handleClose
	}
}
