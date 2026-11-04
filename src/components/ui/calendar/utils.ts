export interface DateParts {
	year: number
	/** 1–12 */
	month: number
	day: number
}

/** 0 — воскресенье, 1 — понедельник … */
export type WeekStart = 0 | 1 | 2 | 3 | 4 | 5 | 6

const ISO_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/

const pad = (value: number, length = 2): string =>
	String(value).padStart(length, "0")

export const toISO = (year: number, month: number, day: number): string =>
	`${pad(year, 4)}-${pad(month)}-${pad(day)}`

export const daysInMonth = (year: number, month: number): number =>
	new Date(Date.UTC(year, month, 0)).getUTCDate()

export const parseISO = (iso: string): DateParts | null => {
	const match = ISO_PATTERN.exec(iso)

	if (!match) return null

	const year = Number(match[1])
	const month = Number(match[2])
	const day = Number(match[3])

	if (month < 1 || month > 12) return null
	if (day < 1 || day > daysInMonth(year, month)) return null

	return { year, month, day }
}

/** Сегодняшняя дата пользователя (по локальному календарю) */
export const todayISO = (): string => {
	const now = new Date()

	return toISO(now.getFullYear(), now.getMonth() + 1, now.getDate())
}

/** Порядковый номер месяца: удобно сравнивать и считать направление перехода */
export const monthIndex = (year: number, month: number): number =>
	year * 12 + month - 1

export const weekdayOf = (iso: string): number => {
	const parts = parseISO(iso)

	return parts
		? new Date(Date.UTC(parts.year, parts.month - 1, parts.day)).getUTCDay()
		: 0
}

export const addDays = (iso: string, amount: number): string => {
	const parts = parseISO(iso)

	if (!parts) return iso

	const date = new Date(
		Date.UTC(parts.year, parts.month - 1, parts.day + amount)
	)

	return toISO(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate())
}

/** Сдвиг на месяцы; день «прижимается» к концу короткого месяца (31 янв → 28 фев) */
export const addMonths = (iso: string, amount: number): string => {
	const parts = parseISO(iso)

	if (!parts) return iso

	const total = monthIndex(parts.year, parts.month) + amount
	const year = Math.floor(total / 12)
	const month = total - year * 12 + 1

	return toISO(year, month, Math.min(parts.day, daysInMonth(year, month)))
}

export const clampISO = (iso: string, min?: string, max?: string): string => {
	if (min && iso < min) return min
	if (max && iso > max) return max

	return iso
}

const positionInWeek = (iso: string, weekStartsOn: WeekStart): number =>
	(weekdayOf(iso) - weekStartsOn + 7) % 7

export const startOfWeek = (iso: string, weekStartsOn: WeekStart): string =>
	addDays(iso, -positionInWeek(iso, weekStartsOn))

export const endOfWeek = (iso: string, weekStartsOn: WeekStart): string =>
	addDays(iso, 6 - positionInWeek(iso, weekStartsOn))

/** Есть ли в месяце хотя бы один день из допустимого диапазона */
export const isMonthInRange = (
	year: number,
	month: number,
	min?: string,
	max?: string
): boolean => {
	const first = toISO(year, month, 1)
	const last = toISO(year, month, daysInMonth(year, month))

	if (max && first > max) return false
	if (min && last < min) return false

	return true
}

/**
 * Сетка месяца всегда 6×7: высота календаря не «прыгает» между месяцами.
 * Дни соседних месяцев — null.
 */
export const buildMonthGrid = (
	year: number,
	month: number,
	weekStartsOn: WeekStart
): (string | null)[][] => {
	const firstWeekday = new Date(Date.UTC(year, month - 1, 1)).getUTCDay()
	const offset = (firstWeekday - weekStartsOn + 7) % 7
	const total = daysInMonth(year, month)

	return Array.from({ length: 6 }, (_, week) =>
		Array.from({ length: 7 }, (_, weekday) => {
			const day = week * 7 + weekday - offset + 1

			return day >= 1 && day <= total ? toISO(year, month, day) : null
		})
	)
}
