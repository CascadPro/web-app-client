export const formatDate = (value?: string | null) => {
	if (!value) return "—"

	const date = new Date(value)

	if (Number.isNaN(date.getTime())) return "—"

	return new Intl.DateTimeFormat("ru", {
		dateStyle: "long",
		timeStyle: "short"
	}).format(date)
}

export function formatRelativeDate(value: string) {
	const date = new Date(value)

	if (Number.isNaN(date.getTime())) {
		return "неизвестно"
	}

	const diff = Date.now() - date.getTime()
	const minutes = Math.floor(diff / 60_000)

	if (minutes < 1) return "только что"

	if (minutes < 60) {
		return `${minutes} ${pluralize(minutes, "минуту", "минуты", "минут")} назад`
	}

	const hours = Math.floor(minutes / 60)

	if (hours < 24) {
		return `${hours} ${pluralize(hours, "час", "часа", "часов")} назад`
	}

	const days = Math.floor(hours / 24)

	if (days < 30) {
		return `${days} ${pluralize(days, "день", "дня", "дней")} назад`
	}

	return formatDate(value)
}

function pluralize(value: number, one: string, few: string, many: string) {
	const mod10 = value % 10
	const mod100 = value % 100

	if (mod10 === 1 && mod100 !== 11) {
		return one
	}

	if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) {
		return few
	}

	return many
}
