import { useScrollLocked } from "@/libs/hooks"

import type { SessionCardSheetProps } from "../components/card/session-card-sheet";

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

	useScrollLocked(isOpen)

	return {
		locationValue,
		locationCopyText
	}
}
