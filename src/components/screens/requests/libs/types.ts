import type { LucideIcon } from "lucide-react"

import type {
	DomainRequestOriginType,
	DomainRequestStatus,
	DomainSortType
} from "@/api/generated"
import { ReactStateHook } from "@/types/base"

export interface RequestStatus {
	value: DomainRequestStatus
	label: string
}

export type RequestStatusIcons = Record<DomainRequestStatus, LucideIcon>

export interface RequestOriginType {
	value: DomainRequestOriginType
	label: string
}

export interface RequestCardDescriptionData {
	itemKey: string
	icon: LucideIcon
	text: string
}

export interface RequestContextState {
	statuses: DomainRequestStatus[]
	sortType: DomainSortType

	isClearDisabled: boolean

	setStatuses: ReactStateHook<DomainRequestStatus[]>
	setSortType: ReactStateHook<DomainSortType>
	clearFilters: () => void
}
