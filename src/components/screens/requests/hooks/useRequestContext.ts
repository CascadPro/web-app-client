import { useMemo, useState } from "react"

import type { DomainRequestStatus, DomainSortType } from "@/api/generated"
import type { RequestContextState } from "@/types/screens/requests"

export const useRequestContextProvider = () => {
	const [statuses, setStatuses] = useState<DomainRequestStatus[]>([])

	const [sortType, setSortType] = useState<DomainSortType>("newest")

	const clearFilters = () => {
		setStatuses([])
		setSortType("newest")
	}

	const isClearDisabled = useMemo(
		() => statuses.length == 0 && sortType === "newest",
		[statuses, sortType]
	)

	const values: RequestContextState = useMemo(
		() => ({
			statuses,
			sortType,
			isClearDisabled,
			setStatuses,
			setSortType,
			clearFilters
		}),
		[statuses, sortType, isClearDisabled, setStatuses, setSortType]
	)

	return { values }
}
