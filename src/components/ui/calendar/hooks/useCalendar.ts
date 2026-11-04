import {
	type KeyboardEvent,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState
} from "react"

import {
	CALENDAR_DEFAULT_LOCALE,
	CALENDAR_DEFAULT_WEEK_START
} from "../constants"
import { formatDayLabel, formatMonthTitle, getWeekdayLabels } from "../format"
import type { CalendarCell, CalendarProps, CalendarView } from "../types"
import {
	addDays,
	addMonths,
	buildMonthGrid,
	clampISO,
	daysInMonth,
	endOfWeek,
	isMonthInRange,
	monthIndex,
	parseISO,
	startOfWeek,
	todayISO,
	toISO
} from "../utils"

type Direction = 1 | -1

interface Cursor {
	year: number
	month: number
}

export const useCalendar = ({
	value,
	onChange,
	min,
	max,
	locale = CALENDAR_DEFAULT_LOCALE,
	weekStartsOn = CALENDAR_DEFAULT_WEEK_START,
	autoFocus = false
}: Pick<
	CalendarProps,
	"value" | "onChange" | "min" | "max" | "locale" | "weekStartsOn" | "autoFocus"
>) => {
	const today = useMemo(todayISO, [])

	const selected = value && parseISO(value) ? value : null

	const [initial] = useState(() => clampISO(selected ?? today, min, max))

	const [view, setView] = useState<CalendarView>("days")
	const [cursor, setCursor] = useState<Cursor>(() => {
		const parts = parseISO(initial)

		return { year: parts?.year ?? 1970, month: parts?.month ?? 1 }
	})
	const [pickerYear, setPickerYear] = useState(cursor.year)
	const [focused, setFocused] = useState(initial)
	const [direction, setDirection] = useState<Direction>(1)

	/** После следующего рендера нужно перевести DOM-фокус на focused */
	const focusRequestRef = useRef(autoFocus)
	const gridRef = useRef<HTMLTableSectionElement>(null)

	const goTo = useCallback(
		(iso: string, moveFocus: boolean) => {
			const parts = parseISO(iso)

			if (!parts) return

			if (parts.year !== cursor.year || parts.month !== cursor.month) {
				setDirection(
					monthIndex(parts.year, parts.month) >
						monthIndex(cursor.year, cursor.month)
						? 1
						: -1
				)
				setCursor({ year: parts.year, month: parts.month })
			}

			setFocused(iso)

			if (moveFocus) focusRequestRef.current = true
		},
		[cursor.year, cursor.month]
	)

	// Значение изменили снаружи (сброс, восстановление черновика) — показываем его месяц
	const previousValueRef = useRef(value)

	useEffect(() => {
		if (value === previousValueRef.current) return

		previousValueRef.current = value

		if (value && parseISO(value)) goTo(clampISO(value, min, max), false)
	}, [value, min, max, goTo])

	useEffect(() => {
		if (!focusRequestRef.current || view !== "days") return

		focusRequestRef.current = false

		gridRef.current
			?.querySelector<HTMLButtonElement>(`[data-date="${focused}"]`)
			?.focus({ preventScroll: true })
	}, [focused, cursor, view])

	const weekdays = useMemo(
		() => getWeekdayLabels(locale, weekStartsOn),
		[locale, weekStartsOn]
	)

	// Подписи ячеек считаются один раз на месяц, а не на каждый рендер
	const weeks = useMemo<(CalendarCell | null)[][]>(
		() =>
			buildMonthGrid(cursor.year, cursor.month, weekStartsOn).map(week =>
				week.map(iso =>
					iso
						? {
								iso,
								day: Number(iso.slice(8)),
								label: formatDayLabel(iso, locale)
							}
						: null
				)
			),
		[cursor.year, cursor.month, weekStartsOn, locale]
	)

	const title =
		view === "days"
			? formatMonthTitle(cursor.year, cursor.month, locale)
			: String(pickerYear)

	const prevMonth = addMonths(toISO(cursor.year, cursor.month, 1), -1)
	const nextMonth = addMonths(toISO(cursor.year, cursor.month, 1), 1)

	const canPrev =
		view === "days"
			? isMonthInRange(
					Number(prevMonth.slice(0, 4)),
					Number(prevMonth.slice(5, 7)),
					min,
					max
				)
			: !min || toISO(pickerYear - 1, 12, 31) >= min

	const canNext =
		view === "days"
			? isMonthInRange(
					Number(nextMonth.slice(0, 4)),
					Number(nextMonth.slice(5, 7)),
					min,
					max
				)
			: !max || toISO(pickerYear + 1, 1, 1) <= max

	const isTodayAllowed = clampISO(today, min, max) === today

	const navigate = useCallback(
		(step: Direction) => {
			if (view === "months") {
				setPickerYear(year => year + step)
				return
			}

			goTo(clampISO(addMonths(focused, step), min, max), false)
		},
		[view, focused, goTo, min, max]
	)

	const toggleView = useCallback(() => {
		setPickerYear(cursor.year)
		setView(current => (current === "days" ? "months" : "days"))
	}, [cursor.year])

	const selectMonth = useCallback(
		(month: number) => {
			const day = Math.min(
				parseISO(focused)?.day ?? 1,
				daysInMonth(pickerYear, month)
			)

			goTo(clampISO(toISO(pickerYear, month, day), min, max), false)
			setView("days")
		},
		[focused, pickerYear, goTo, min, max]
	)

	const select = useCallback(
		(iso: string) => {
			setFocused(iso)
			onChange(iso)
		},
		[onChange]
	)

	const selectToday = useCallback(() => {
		if (!isTodayAllowed) return

		goTo(today, false)
		select(today)
	}, [isTodayAllowed, today, goTo, select])

	const handleKeyDown = useCallback(
		(event: KeyboardEvent<HTMLElement>) => {
			if (event.altKey || event.ctrlKey || event.metaKey) return

			let next: string | null = null

			switch (event.key) {
				case "ArrowLeft":
					next = addDays(focused, -1)
					break
				case "ArrowRight":
					next = addDays(focused, 1)
					break
				case "ArrowUp":
					next = addDays(focused, -7)
					break
				case "ArrowDown":
					next = addDays(focused, 7)
					break
				case "Home":
					next = startOfWeek(focused, weekStartsOn)
					break
				case "End":
					next = endOfWeek(focused, weekStartsOn)
					break
				case "PageUp":
					next = addMonths(focused, event.shiftKey ? -12 : -1)
					break
				case "PageDown":
					next = addMonths(focused, event.shiftKey ? 12 : 1)
					break
				default:
					return
			}

			event.preventDefault()

			const target = clampISO(next, min, max)

			if (target !== focused) goTo(target, true)
		},
		[focused, weekStartsOn, min, max, goTo]
	)

	return {
		view,
		cursor,
		pickerYear,
		direction,
		focused,
		selected,
		today,
		title,
		weekdays,
		weeks,
		canPrev,
		canNext,
		isTodayAllowed,
		gridRef,
		navigate,
		toggleView,
		selectMonth,
		select,
		selectToday,
		handleKeyDown
	}
}
