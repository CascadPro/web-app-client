export function getCssVar(property: string) {
	const variable = getComputedStyle(document.documentElement).getPropertyValue(
		property
	)

	return variable.trim()
}
