import { CalendarDaysIcon, CircleCheckIcon, ClockIcon } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"

import type { RequestHttpDtoGetRequestsResponseRequest as Request } from "@/api/generated"
import { useScrollLocked } from "@/libs/hooks"

import {
	formatRequestDate,
	getRequestProgress,
	type RequestCardDescriptionData
} from "../libs"

const LONG_PRESS_DELAY = 450
const ACTIONS_HEIGHT = 400
const VIEWPORT_PADDING = 16

type Params = Pick<Request, "fields_remaining" | "created_at" | "deadline">

export const useRequestCard = ({
	fields_remaining,
	created_at,
	deadline
}: Params) => {
	const progress = useMemo(
		() => getRequestProgress(fields_remaining || 0),
		[fields_remaining]
	)

	const descriptionData: RequestCardDescriptionData[] = useMemo(
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

	const [isCollapsed, setIsCollapsed] = useState<boolean>(true)
	const [isSelected, setIsSelected] = useState<boolean>(false)
	const [selectedY, setSelectedY] = useState<number>(0)

	const ref = useRef<HTMLElement>(null)

	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

	const clearLongPress = () => {
		if (timeoutRef.current !== null) {
			clearTimeout(timeoutRef.current)
			timeoutRef.current = null
		}
	}

	const selectCard = () => {
		const element = ref.current

		if (!element) return

		const rect = element.getBoundingClientRect()

		const minTop = VIEWPORT_PADDING

		const maxTop = window.innerHeight - VIEWPORT_PADDING - rect.height

		const availableHeight =
			window.innerHeight - ACTIONS_HEIGHT - VIEWPORT_PADDING * 2

		const targetTop = VIEWPORT_PADDING + (availableHeight - rect.height) / 2

		const clampedTop = Math.max(minTop, Math.min(targetTop, maxTop))

		const translateY = clampedTop - rect.top

		setSelectedY(translateY)
		setIsSelected(true)
	}

	const handleTouchStart = () => {
		clearLongPress()

		timeoutRef.current = setTimeout(() => {
			selectCard()

			if (isSelected) {
				setIsSelected(false)
				setIsCollapsed(true)
				setSelectedY(0)
			}

			timeoutRef.current = null
		}, LONG_PRESS_DELAY)
	}

	const handleTouchEnd = () => {
		clearLongPress()
	}

	const handleTouchCancel = () => {
		clearLongPress()
	}

	const handleClickOutside = () => {
		setIsSelected(false)
		setIsCollapsed(true)
		setSelectedY(0)
	}

	useEffect(() => {
		return () => {
			clearLongPress()
		}
	}, [])

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
		handleClickOutside
	}
}
