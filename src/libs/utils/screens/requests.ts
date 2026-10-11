import type { DomainRequestStatus } from "@/api/generated"

export function getRequestStatusLabel(status: DomainRequestStatus): string {
	const labels: Record<DomainRequestStatus, string> = {
		default: "Черновик",
		waiting: "На рассмотрении",
		approved: "Одобрена",
		rejected: "Отклонена",
		"": ""
	}

	return labels[status]
}

export function formatRequestDate(value?: string | null): string {
	if (!value) return "Не указан"

	const date = new Date(value)

	if (Number.isNaN(date.getTime())) {
		return "Не указан"
	}

	return new Intl.DateTimeFormat("ru-RU", {
		day: "numeric",
		month: "long",
		year: "numeric"
	}).format(date)
}

const TOTAL_FIELDS = 7

export function getRequestProgress(remaining: number): number {
	return Math.round(
		((TOTAL_FIELDS - Math.min(Math.max(remaining, 0), TOTAL_FIELDS)) /
			TOTAL_FIELDS) *
			100
	)
}
