import type { WeekStart } from "./utils"

export type CalendarView = "days" | "months"

export interface CalendarProps {
	/** Выбранная дата в формате YYYY-MM-DD */
	value?: string | null
	onChange: (value: string) => void
	/** Самая ранняя доступная дата (YYYY-MM-DD) */
	min?: string
	/** Самая поздняя доступная дата (YYYY-MM-DD) */
	max?: string
	locale?: string
	weekStartsOn?: WeekStart
	/** Сразу перевести фокус на выбранный (или сегодняшний) день */
	autoFocus?: boolean
	/** Кнопка быстрого выбора сегодняшней даты */
	showToday?: boolean
	className?: string
	"aria-label"?: string
}

export interface CalendarCell {
	iso: string
	day: number
	label: string
}
