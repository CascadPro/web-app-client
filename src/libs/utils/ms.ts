const SECOND = 1000
const MINUTE = SECOND * 60
const HOUR = MINUTE * 60
const DAY = HOUR * 24
const WEEK = DAY * 7
const YEAR = DAY * 365.25

const UNIT_VALUES: Record<string, number> = {
	ms: 1,
	msec: 1,
	msecs: 1,
	millisecond: 1,
	milliseconds: 1,

	s: SECOND,
	sec: SECOND,
	secs: SECOND,
	second: SECOND,
	seconds: SECOND,

	m: MINUTE,
	min: MINUTE,
	mins: MINUTE,
	minute: MINUTE,
	minutes: MINUTE,

	h: HOUR,
	hr: HOUR,
	hrs: HOUR,
	hour: HOUR,
	hours: HOUR,

	d: DAY,
	day: DAY,
	days: DAY,

	w: WEEK,
	week: WEEK,
	weeks: WEEK,

	y: YEAR,
	yr: YEAR,
	yrs: YEAR,
	year: YEAR,
	years: YEAR
}

const NUMBER_RE = /^-?(?:\d+(?:\.\d*)?|\.\d+)$/

/**
 * Converts a human-readable time string into milliseconds.
 *
 * Supports:
 * - "100"
 * - "100ms"
 * - "100 ms"
 * - "2s"
 * - "2 seconds"
 * - "1.5h"
 * - ".5 days"
 * - "-2m"
 *
 * @returns milliseconds, or NaN when the value is invalid
 */
export function ms(value: string): number {
	if (value.length === 0 || value.length > 100) {
		throw new Error(
			"Value provided to ms() must be a string with length between 1 and 100."
		)
	}

	const normalized = value.trim().toLowerCase()

	if (!normalized) {
		return Number.NaN
	}

	// "1.5 hours" / "1.5h"
	const parts = normalized.split(/\s+/)

	if (parts.length > 2) {
		return Number.NaN
	}

	let amount = parts[0]
	let unit = parts[1] ?? "ms"

	// "1.5h" / ".5s" / "-2days"
	if (!NUMBER_RE.test(amount)) {
		let index = 0

		while (index < amount.length) {
			const char = amount[index]

			if ((char >= "a" && char <= "z") || (char >= "A" && char <= "Z")) {
				break
			}

			index++
		}

		unit = amount.slice(index)
		amount = amount.slice(0, index)
	}

	if (!NUMBER_RE.test(amount)) {
		return Number.NaN
	}

	const multiplier = UNIT_VALUES[unit]

	if (multiplier === undefined) {
		return Number.NaN
	}

	return Number(amount) * multiplier
}
