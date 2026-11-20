import type { PanInfo } from "motion/react"
import { useCallback } from "react"

import { useMotionScale } from "@/libs/motion"

interface Props {
	view: "days" | "months"
	canNext: boolean
	canPrev: boolean
	navigate: (dir: 1 | -1) => void
}

export const useCalendarComponent = (calendar: Props) => {
	const scale = useMotionScale()

	const handleDragEnd = useCallback(
		(_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
			const threshold = 75
			const velocityThreshold = 500

			if (
				calendar.canNext &&
				(info.offset.x < -threshold || info.velocity.x < -velocityThreshold)
			) {
				calendar.navigate(1)
			} else if (
				calendar.canPrev &&
				(info.offset.x > threshold || info.velocity.x > velocityThreshold)
			) {
				calendar.navigate(-1)
			}
		},
		[calendar.navigate, calendar.canNext, calendar.canPrev]
	)

	const isDays = calendar.view === "days"

	return {
		scale,
		isDays,
		handleDragEnd
	}
}
