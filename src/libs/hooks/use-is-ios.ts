"use client"

import { useEffect, useState } from "react"

export function useIsIOS(): boolean {
	const [isIOS, setIsIOS] = useState(false)

	useEffect(() => {
		setIsIOS(
			/iPhone|iPad|iPod/i.test(navigator.userAgent) ||
				(navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
		)
	}, [])

	return isIOS
}
