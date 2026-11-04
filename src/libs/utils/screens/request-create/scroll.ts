/** Прокручивает к началу списка заявок (id задан в RequestsList) */
export const scrollToRequestList = (reduceMotion: boolean): void => {
	document.getElementById("request-list")?.scrollIntoView({
		behavior: reduceMotion ? "auto" : "smooth",
		block: "start"
	})
}
