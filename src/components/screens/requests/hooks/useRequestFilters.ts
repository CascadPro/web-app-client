import type { Dispatch, SetStateAction } from "react"
import { useCallback, useState } from "react"

import type { DomainRequestStatus, DomainSortType } from "@/api/generated"

import { useRequestContext } from "../requests-context"

interface UseRequestFiltersReturn {
	sortType: DomainSortType
	isOpen: boolean
	isClearDisabled: boolean
	isActive: (value: DomainRequestStatus) => boolean
	setIsOpen: Dispatch<SetStateAction<boolean>>
	toggleStatus: (status: DomainRequestStatus) => void
	setSortType: (sort: DomainSortType) => void
	clearFilters: () => void
}

export const useRequestFilters = (): UseRequestFiltersReturn => {
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
