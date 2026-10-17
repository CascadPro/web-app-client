import { useCallback, useState } from "react"

import type { DomainRequestStatus } from "@/api/generated"

import { useRequestContext } from "../requests-context"

export const useRequestFilters = () => {
	const {
		statuses,
		sortType,
		isClearDisabled,
		setStatuses,
		setSortType,
		clearFilters
	} = useRequestContext()

	const [isOpen, setIsOpen] = useState(false)

	const toggleStatus = useCallback(
		(status: DomainRequestStatus) => {
			setStatuses(previous =>
				previous.includes(status)
					? previous.filter(item => item !== status)
					: [...previous, status]
			)
		},
		[setStatuses]
	)

	const isActive = useCallback(
		(value: DomainRequestStatus) => statuses.includes(value),
		[statuses]
	)

	return {
		sortType,
		isOpen,
		isClearDisabled,
		isActive,
		setIsOpen,
		toggleStatus,
		setSortType,
		clearFilters
	}
}
