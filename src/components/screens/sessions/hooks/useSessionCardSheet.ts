import { useEffect } from "react"

import type { SessionCardSheetProps } from "../components/card/session-card-sheet"

export const useSessionCardSheet = (
	isOpen: boolean,
	location: SessionCardSheetProps["location"]
) => {
	const locationValue = [location?.city, location?.country]
		.filter(Boolean)
		.join(", ")

	const locationCopyText = [location?.lat, location?.lng]
		.filter(Boolean)
		.join(", ")

	useEffect(() => {
		if (isOpen) {
			document.body.classList.add("scroll-locked")
		} else {
			document.body.classList.remove("scroll-locked")
		}
	}, [isOpen])

	return {
		locationValue,
		locationCopyText
	}
}
