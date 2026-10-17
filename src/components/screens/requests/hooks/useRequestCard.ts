import { CalendarDaysIcon, CircleCheckIcon, ClockIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import type { RequestHttpDtoGetRequestsResponseRequest as Request } from "@/api/generated"
import { useScrollLocked } from "@/libs/hooks"
import {
	formatRequestDate,
	getRequestProgress
} from "@/libs/utils/screens/requests"
import type { RequestCardDescriptionData } from "@/types/screens/requests"

const LONG_PRESS_DELAY = 450
const ACTIONS_HEIGHT = 400
const VIEWPORT_PADDING = 16

type Params = Pick<Request, "fields_remaining" | "created_at" | "deadline">

export const useRequestCard = ({
	fields_remaining,
	created_at,
	deadline
}: Params) => {
	const [isCollapsed, setIsCollapsed] = useState(true)
	const [isSelected, setIsSelected] = useState(false)
	const [selectedY, setSelectedY] = useState(0)

	const ref = useRef<HTMLElement>(null)
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

	const progress = useMemo(
		() => getRequestProgress(fields_remaining || 0),
		[fields_remaining]
	)

	const descriptionData = useMemo<RequestCardDescriptionData[]>(
		() => [
			{
				itemKey: "created_date",
				icon: CalendarDaysIcon,
				text: `Заявка от ${formatRequestDate(created_at)}`
			},
			{
				itemKey: "fields_remaining",
				icon: CircleCheckIcon,
				text:
					fields_remaining && fields_remaining > 0
						? `Осталось полей: ${fields_remaining}`
						: "Все обязательные поля заполнены"
			},
			{
				itemKey: "deadline_date",
				icon: ClockIcon,
				text: deadline
					? `Срок сдачи ${formatRequestDate(deadline)}`
					: "Срок сдачи не задан"
			}
		],
		[fields_remaining, created_at, deadline]
	)

	const clearLongPress = useCallback(() => {
		if (timeoutRef.current === null) return

		clearTimeout(timeoutRef.current)
		timeoutRef.current = null
	}, [])

	const closeCard = useCallback(() => {
		clearLongPress()
		setIsSelected(false)
		setIsCollapsed(true)
		setSelectedY(0)
	}, [clearLongPress])

	const selectCard = useCallback(() => {
		const element = ref.current

		if (!element) return

		const rect = element.getBoundingClientRect()
		const viewportHeight = window.innerHeight

		const minTop = VIEWPORT_PADDING
		const maxTop = Math.max(
			minTop,
			viewportHeight - VIEWPORT_PADDING - rect.height
		)

		const availableHeight =
			viewportHeight - ACTIONS_HEIGHT - VIEWPORT_PADDING * 2

		const targetTop = VIEWPORT_PADDING + (availableHeight - rect.height) / 2

		const clampedTop = Math.max(minTop, Math.min(targetTop, maxTop))

		setSelectedY(clampedTop - rect.top)
		setIsSelected(true)
	}, [])

	const handleTouchStart = useCallback(() => {
		clearLongPress()

		timeoutRef.current = setTimeout(() => {
			timeoutRef.current = null

			if (isSelected) {
				closeCard()
				return
			}

			selectCard()
		}, LONG_PRESS_DELAY)
	}, [clearLongPress, closeCard, isSelected, selectCard])

	const handleTouchEnd = clearLongPress
	const handleTouchCancel = clearLongPress

	useEffect(() => clearLongPress, [clearLongPress])

	useScrollLocked(isSelected)

	return {
		ref,
		progress,
		descriptionData,
		isSelected,
		isCollapsed,
		selectedY,
		setIsCollapsed,
		handleTouchStart,
		handleTouchEnd,
		handleTouchCancel,
		handleClickOutside: closeCard
	}
}
