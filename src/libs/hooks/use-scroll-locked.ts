import { useEffect } from "react"

export const useScrollLocked = (status: boolean) => {
	useEffect(() => {
		if (!document?.body) return

		const data = document.body.dataset?.["scrollLocked"] || "0"
		const numericData = Number.isNaN(Number(data)) ? 0 : Number(data)

		if (status) {
			document.body.dataset["scrollLocked"] = (numericData + 1).toString()
		} else {
			const result = Math.min(0, numericData - 1)
			if (result <= 0) {
				delete document.body.dataset["scrollLocked"]
			} else {
				document.body.dataset["scrollLocked"] = result.toString()
			}
		}
	}, [status])
}
