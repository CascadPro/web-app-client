/**
 * Делает первую букву в слове заглавной
 * @param {string} name Слово которое надо "капитализировать"
 * @returns Слово с первой заглавной буквой
 */
export function capitalize(name: string): string {
	const splitted = name.split("")
	const first = splitted[0].toUpperCase()

	const result = [
		first,
		...splitted.splice(1, splitted.length - 1).map(s => s.toLowerCase())
	].join("")

	return result
}
