import { useReducedMotion } from "motion/react"
import { useCallback, useEffect, useMemo, useRef } from "react"

import { DomainRequestStatus } from "@/api/generated"
import { useRequestStats } from "@/libs/query/hooks/use-requests"

import { useRequestContext } from "../requests-context"

interface Stats {
	label: string
	value: number
	onClick: () => void
}

const useRequestStatsHook = () => {
	const reduceMotion = useReducedMotion()

	const { statistics, isPending } = useRequestStats()
	const { setStatuses } = useRequestContext()

	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

	const waiting =
		statistics?.by_status?.[DomainRequestStatus.RequestStatusWaiting] ?? 0

	const approved =
		statistics?.by_status?.[DomainRequestStatus.RequestStatusApproved] ?? 0

	const rejected =
		statistics?.by_status?.[DomainRequestStatus.RequestStatusRejected] ?? 0

	const scrollToList = useCallback(() => {
		if (timeoutRef.current !== null) {
			clearTimeout(timeoutRef.current)
		}

		timeoutRef.current = setTimeout(() => {
			timeoutRef.current = null

			requestAnimationFrame(() => {
				document.getElementById("request-list")?.scrollIntoView({
					behavior: "smooth",
					block: "start"
				})
			})
		}, 300)
	}, [])

	const handleStatusClick = useCallback(
		(status: DomainRequestStatus) => {
			setStatuses([status])
			scrollToList()
		},
		[setStatuses, scrollToList]
	)

	useEffect(
		() => () => {
			if (timeoutRef.current !== null) {
				clearTimeout(timeoutRef.current)
			}
		},
		[]
	)

	const stats = useMemo<Stats[]>(
		() => [
			{
				label: "Всего заявок",
				value: statistics?.total ?? 0,
				onClick: scrollToList
			},
			{
				label: "На рассмотрении",
				value: waiting,
				onClick: () =>
					handleStatusClick(DomainRequestStatus.RequestStatusWaiting)
			},
			{
				label: "Одобрено",
				value: approved,
				onClick: () =>
					handleStatusClick(DomainRequestStatus.RequestStatusApproved)
			},
			{
				label: "Отклонено",
				value: rejected,
				onClick: () =>
					handleStatusClick(DomainRequestStatus.RequestStatusRejected)
			}
		],
		[
			statistics?.total,
			waiting,
			approved,
			rejected,
			scrollToList,
			handleStatusClick
		]
	)

	return { stats, reduceMotion, isPending }
}

export { useRequestStatsHook as useRequestStats }
