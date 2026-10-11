import {
	BadgeCheckIcon,
	CircleQuestionMarkIcon,
	ClockIcon,
	FilePenIcon,
	XCircleIcon
} from "lucide-react"

import type {
	RequestOriginType,
	RequestStatus,
	RequestStatusIcons
} from "./types"

export const REQUEST_STATUSES: RequestStatus[] = [
	{ value: "default", label: "Черновик" },
	{ value: "waiting", label: "На рассмотрении" },
	{ value: "approved", label: "Одобрена" },
	{ value: "rejected", label: "Отклонена" }
]

export const REQUEST_STATUS_ICON: RequestStatusIcons = {
	default: FilePenIcon,
	waiting: ClockIcon,
	approved: BadgeCheckIcon,
	rejected: XCircleIcon,
	"": CircleQuestionMarkIcon
}

export const REQUEST_ORIGIN_TYPES: RequestOriginType[] = [
	{ value: "email", label: "Email" },
	{ value: "phone", label: "Телефон" },
	{ value: "other", label: "Другое" }
]

export const DEFAULT_REQUESTS_PAGE = 1
export const DEFAULT_REQUESTS_LIMIT = 10
