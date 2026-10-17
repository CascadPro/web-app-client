import { useMemo } from "react"

import { useRequests } from "@/libs/query/hooks/use-requests"
import { errorCatch } from "@/libs/utils"

import { useRequestContext } from "../requests-context"

const LIMIT = 10

export const useRequestsScreen = () => {
	const { sortType, statuses } = useRequestContext()

	const params = useMemo(
		() => ({
			page: 1,
			limit: LIMIT,
			sort: sortType,
			statuses: statuses.length ? statuses : undefined
		}),
		[sortType, statuses]
	)

	const { requests, error, isPending, isLoading, isRefetching } =
		useRequests(params)

	return {
		requests,
		isPending,
		error: error ? errorCatch(error) : null,
		isLoading: isLoading || isRefetching
	}
}
