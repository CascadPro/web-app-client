const pad = (value: number): string => String(value).padStart(2, "0")

/** Сегодняшняя дата пользователя в формате YYYY-MM-DD (для min у <input type="date">) */
export const getTodayISO = (): string => {
	const now = new Date()

	return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

/**
 * YYYY-MM-DD → RFC3339. Берём полдень UTC: при показе в любой часовой зоне
 * (от UTC-12 до UTC+12) календарный день остаётся тем, что выбрал пользователь.
 */
export const toDeadlineISO = (date: string): string => `${date}T12:00:00Z`
