import type { SessionCardSheetProps } from "../components/card/session-card-sheet"

interface UseSessionCardSheetReturn {
	locationValue: string
	locationCopyText: string
}

export const useSessionCardSheet = (
	location: SessionCardSheetProps["location"]
): UseSessionCardSheetReturn => {
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
