import { useState } from "react"

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

	const [isOpen, setIsOpen] = useState<boolean>(false)

	const toggleStatus = (status: DomainRequestStatus) => {
		setStatuses(prev =>
			prev.includes(status)
				? prev.filter(item => item !== status)
				: [...prev, status]
		)
	}

	const isActive = (value: DomainRequestStatus) => statuses.includes(value)

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
