import { parseISO } from "./utils"
import type { WeekStart } from "./utils"

/** Intl.DateTimeFormat дорогой в создании — держим по одному на набор опций */
const formatters = new Map<string, Intl.DateTimeFormat>()

const getFormatter = (
	locale: string,
	options: Intl.DateTimeFormatOptions
): Intl.DateTimeFormat => {
	const key = `${locale}|${JSON.stringify(options)}`

	let formatter = formatters.get(key)

	if (!formatter) {
		formatter = new Intl.DateTimeFormat(locale, { ...options, timeZone: "UTC" })
		formatters.set(key, formatter)
	}

	return formatter
}

const toUTC = (iso: string): number | null => {
	const parts = parseISO(iso)

	return parts ? Date.UTC(parts.year, parts.month - 1, parts.day) : null
}

const capitalize = (value: string, locale: string): string =>
	value.charAt(0).toLocaleUpperCase(locale) + value.slice(1)

/** «четверг, 5 ноября 2026 г.» — для aria-label ячейки */
export const formatDayLabel = (iso: string, locale: string): string => {
	const time = toUTC(iso)

	return time === null
		? iso
		: getFormatter(locale, {
				weekday: "long",
				day: "numeric",
				month: "long",
				year: "numeric"
			}).format(time)
}

/** «5 ноября 2026 г.» — для показа выбранной даты */
export const formatCalendarDate = (
	iso: string,
	locale: string = "ru-RU"
): string => {
	const time = toUTC(iso)

	return time === null
		? iso
		: getFormatter(locale, {
				day: "numeric",
				month: "long",
				year: "numeric"
			}).format(time)
}

/** «Ноябрь 2026» */
export const formatMonthTitle = (
	year: number,
	month: number,
	locale: string
): string => {
	const parts = getFormatter(locale, {
		month: "long",
		year: "numeric"
	}).formatToParts(Date.UTC(year, month - 1, 1))

	const name = parts.find(part => part.type === "month")?.value ?? ""
	const number = parts.find(part => part.type === "year")?.value ?? ""

	return `${capitalize(name, locale)} ${number}`.trim()
}

export const formatMonthName = (month: number, locale: string): string =>
	getFormatter(locale, { month: "long" }).format(Date.UTC(2000, month - 1, 1))

export interface WeekdayLabel {
	short: string
	long: string
}

/** Подписи колонок, начиная с weekStartsOn */
export const getWeekdayLabels = (
	locale: string,
	weekStartsOn: WeekStart
): WeekdayLabel[] =>
	Array.from({ length: 7 }, (_, index) => {
		// 2023-01-01 — воскресенье
		const time = Date.UTC(2023, 0, 1 + ((weekStartsOn + index) % 7))

		return {
			short: getFormatter(locale, { weekday: "short" }).format(time),
			long: getFormatter(locale, { weekday: "long" }).format(time)
		}
	})
