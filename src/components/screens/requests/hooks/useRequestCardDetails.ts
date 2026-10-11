import { useMemo } from "react"

import { useRequestDetail } from "@/libs/query/hooks/use-requests"

export const useRequestCardDetails = (id: string, isCollapsed: boolean) => {
	const { request, isPending } = useRequestDetail(id, !isCollapsed)

	const height = useMemo(() => {
		if (isPending) return 11

		let h = 0

		if (request?.origin) h += 7

		if (request?.client) h += 7

		if (request?.geography_description) h += 2

		if (request?.work_types) h += 2

		if (request?.status_by) h += 7

		if (h !== 0) h += 3

		return h
	}, [
		request?.origin?.length,
		request?.client?.id,
		request?.geography_description?.length,
		request?.work_types?.length,
		request?.status_by?.id,
		isPending
	])

	return {
		request,
		isPending,
		height
	}
}
