import type { WeekStart } from "./utils"

export const CALENDAR_DEFAULT_LOCALE = "ru-RU"
export const CALENDAR_DEFAULT_WEEK_START: WeekStart = 1

/** Расстояние сдвига при смене месяца (px): небольшое, чтобы было мягко и дёшево */
export const CALENDAR_SLIDE_DISTANCE = 28

export const CALENDAR_LABELS = {
	prevMonth: "Предыдущий месяц",
	nextMonth: "Следующий месяц",
	prevYear: "Предыдущий год",
	nextYear: "Следующий год",
	chooseMonth: "выбрать месяц и год",
	months: "Месяцы",
	today: "Сегодня"
} as const
