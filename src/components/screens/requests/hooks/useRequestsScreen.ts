import { useMemo } from "react"

import type { RequestHttpDtoGetRequestsResponseRequest as Request } from "@/api/generated"
import { useRequests } from "@/libs/query/hooks/use-requests"
import type { ErrorCatchResult } from "@/libs/utils"
import { errorCatch } from "@/libs/utils"

import { useRequestContext } from "../requests-context"

interface UseRequestsScreenReturn {
	requests: Request[]
	isPending: boolean
	error: ErrorCatchResult | null
	isLoading: boolean
}

const LIMIT = 10

export const useRequestsScreen = (): UseRequestsScreenReturn => {
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
