import { useCallback, useMemo, useState } from "react"

import type { DomainRequestStatus, DomainSortType } from "@/api/generated"
import type { RequestContextState } from "@/types/screens/requests"

interface UseRequestContextProviderReturn {
	values: RequestContextState
}

export const useRequestContextProvider =
	(): UseRequestContextProviderReturn => {
		const [statuses, setStatuses] = useState<DomainRequestStatus[]>([])
		const [sortType, setSortType] = useState<DomainSortType>("newest")

		const clearFilters = useCallback(() => {
			setStatuses([])
			setSortType("newest")
		}, [])

		const isClearDisabled = useMemo(
			() => statuses.length === 0 && sortType === "newest",
			[statuses, sortType]
		)

		const values = useMemo<RequestContextState>(
			() => ({
				statuses,
				sortType,
				isClearDisabled,
				setStatuses,
				setSortType,
				clearFilters
			}),
			[statuses, sortType, isClearDisabled, clearFilters]
		)

		return { values }
	}
