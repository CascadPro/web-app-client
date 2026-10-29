import { useReducedMotion } from "motion/react"
import { useCallback, useEffect, useState } from "react"

import { toast } from "../../toast"

export const useCopyIcon = (
	disabled: boolean,
	notify: boolean,
	onCopy: () => Promise<void>
) => {
	const reduceMotion = useReducedMotion()

	const [burst, setBurst] = useState<number | null>(null)

	useEffect(() => {
		if (burst === null) return

		const timeoutId = window.setTimeout(() => {
			setBurst(null)
		}, 480)

		return () => window.clearTimeout(timeoutId)
	}, [burst])

	const handleClick = useCallback(() => {
		if (disabled) return

		if (!reduceMotion) {
			setBurst(current => (current ?? 0) + 1)
		}

		if (notify) {
			toast.info("Текст скопирован!", { miniature: true, duration: 2000 })
		}

		void onCopy()
	}, [disabled, onCopy, reduceMotion])

	return {
		reduceMotion,
		burst,
		handleClick
	}
}
