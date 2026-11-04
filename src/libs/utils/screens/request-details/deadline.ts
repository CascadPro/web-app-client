const DAY = 86_400_000
const DATE_PART = /^(\d{4})-(\d{2})-(\d{2})/

const pad = (value: number, length = 2): string =>
	String(value).padStart(length, "0")

/**
 * RFC3339 → YYYY-MM-DD по UTC. Срок хранится как полдень UTC (см. toDeadlineISO),
 * поэтому UTC-дата совпадает с тем, что выбрал пользователь, в любом часовом поясе.
 */
export const deadlineToDateInput = (value?: string | null): string => {
	if (!value) return ""

	const date = new Date(value)

	if (Number.isNaN(date.getTime())) return ""

	return `${pad(date.getUTCFullYear(), 4)}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`
}

/** Целых дней от `from` до `to` (обе даты в YYYY-MM-DD). Отрицательное — `to` раньше */
export const daysBetween = (from: string, to: string): number => {
	const a = DATE_PART.exec(from)
	const b = DATE_PART.exec(to)

	if (!a || !b) return Number.NaN

	return Math.round(
		(Date.UTC(Number(b[1]), Number(b[2]) - 1, Number(b[3])) -
			Date.UTC(Number(a[1]), Number(a[2]) - 1, Number(a[3]))) /
			DAY
	)
}

/** Склонение: pluralize(2, ["день", "дня", "дней"]) → "дня" */
export const pluralize = (
	amount: number,
	forms: [string, string, string]
): string => {
	const abs = Math.abs(amount) % 100
	const last = abs % 10

	if (abs > 10 && abs < 20) return forms[2]
	if (last > 1 && last < 5) return forms[1]
	if (last === 1) return forms[0]

	return forms[2]
}

export type DeadlineTone = "overdue" | "soon" | "normal"

export interface DeadlineInfo {
	days: number
	tone: DeadlineTone
	label: string
}

const DAYS: [string, string, string] = ["день", "дня", "дней"]

/** Сколько осталось до срока и насколько это срочно. `today` — YYYY-MM-DD */
export const getDeadlineInfo = (
	deadline: string | null | undefined,
	today: string
): DeadlineInfo | null => {
	const date = deadlineToDateInput(deadline)

	if (!date) return null

	const days = daysBetween(today, date)

	if (Number.isNaN(days)) return null

	if (days < 0) {
		const overdue = -days

		return {
			days,
			tone: "overdue",
			label: `просрочено на ${overdue} ${pluralize(overdue, DAYS)}`
		}
	}

	if (days === 0) return { days, tone: "soon", label: "сегодня" }
	if (days === 1) return { days, tone: "soon", label: "завтра" }

	return {
		days,
		tone: days <= 3 ? "soon" : "normal",
		label: `через ${days} ${pluralize(days, DAYS)}`
	}
}
