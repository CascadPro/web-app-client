export const copyTextToClipboard = async (text: string) => {
	if (!text) return

	try {
		if (navigator.clipboard?.writeText) {
			await navigator.clipboard.writeText(text)
		} else {
			const textarea = document.createElement("textarea")

			textarea.value = text
			textarea.setAttribute("readonly", "")
			textarea.style.position = "fixed"
			textarea.style.left = "-9999px"
			textarea.style.top = "0"
			textarea.style.opacity = "0"

			document.body.appendChild(textarea)

			textarea.focus()
			textarea.select()

			const successful = document.execCommand("copy")

			textarea.remove()

			if (!successful) {
				throw new Error("Failed to copy text")
			}
		}
	} catch (error) {
		console.error("Failed to copy user ID:", error)
	}
}
