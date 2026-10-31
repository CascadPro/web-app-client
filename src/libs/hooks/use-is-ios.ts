import { useLayoutEffect, useState } from "react"

const IOS_DETECTION_REGEX = /iPhone|iPad|iPod/i

function detectIOS(): boolean {
	if (typeof navigator === "undefined") return false

	return (
		IOS_DETECTION_REGEX.test(navigator.userAgent) ||
		(navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
	)
}

export function useIsIOS(): boolean {
	const [isIOS, setIsIOS] = useState(false)

	useLayoutEffect(() => {
		setIsIOS(detectIOS())
	}, [])

	return isIOS
}
