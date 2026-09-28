import type { SessionCardSheetProps } from "../components/card/session-card-sheet"

export const useSessionCardSheet = (
	location: SessionCardSheetProps["location"]
) => {
	const locationValue = [location?.city, location?.country]
		.filter(Boolean)
		.join(", ")

	const locationCopyText = [location?.lat, location?.lng]
		.filter(Boolean)
		.join(", ")

	return {
		locationValue,
		locationCopyText
	}
}
