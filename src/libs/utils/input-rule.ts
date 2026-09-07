export function onInputRule(element: HTMLInputElement | HTMLTextAreaElement) {
	const value = element.value
	const split = value.split("")

	const lastIndex = split.length - 1

	if (split[lastIndex] === " ") element.value = value.slice(0, -1)
}

export function onInputRuleWithSpaces(
	element: HTMLInputElement | HTMLTextAreaElement
) {
	const value = element.value
	const split = value.split("")

	const lastIndex = split.length - 1
	const preLastIndex = split.length - 2

	if (value.length === 1 && split[0] === " ") element.value = ""
	if (split[lastIndex] === " " && split[preLastIndex] === " ")
		element.value = value.slice(0, -1)
}
