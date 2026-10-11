import { useMemo } from "react"

import { DomainRequestStatus } from "@/api/generated"
import { useRequestStats } from "@/libs/query/hooks/use-requests"

import { useRequestContext } from "../requests-context"

interface Stats {
	label: string
	value: number
	onClick: () => void
}

const useRequestStatsHook = () => {
	const { statistics, isPending } = useRequestStats()

	const waiting =
		statistics?.by_status?.[DomainRequestStatus.RequestStatusWaiting]

	const approved =
		statistics?.by_status?.[DomainRequestStatus.RequestStatusApproved]

	const rejected =
		statistics?.by_status?.[DomainRequestStatus.RequestStatusRejected]

	const { setStatuses } = useRequestContext()

	const scrollToList = () => {
		setTimeout(
			() =>
				requestAnimationFrame(() => {
					document.getElementById("request-list")?.scrollIntoView({
						behavior: "smooth",
						block: "start"
					})
				}),
			300
		)
	}

	const handleStatusClick = (status: DomainRequestStatus) => {
		setStatuses([status])
		scrollToList()
	}

	const stats: Stats[] = useMemo(
		() => [
			{
				label: "Всего заявок",
				value: statistics?.total || 0,
				onClick: scrollToList
			},
			{
				label: "На рассмотрении",
				value: waiting || 0,
				onClick: () =>
					handleStatusClick(DomainRequestStatus.RequestStatusWaiting)
			},
			{
				label: "Одобрено",
				value: approved || 0,
				onClick: () =>
					handleStatusClick(DomainRequestStatus.RequestStatusApproved)
			},
			{
				label: "Отклонено",
				value: rejected || 0,
				onClick: () =>
					handleStatusClick(DomainRequestStatus.RequestStatusRejected)
			}
		],
		[statistics?.total, waiting, approved, rejected]
	)

	return { stats, isPending }
}

export { useRequestStatsHook as useRequestStats }
