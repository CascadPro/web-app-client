import { useEffect, useState } from "react"

type PWANavigator = Navigator & { standalone?: boolean }

function checkPWA(): boolean {
	if (typeof window === "undefined") return false

	const media = window.matchMedia("(display-mode: standalone)")
	const iosStandalone =
		"standalone" in navigator && (navigator as PWANavigator).standalone === true

	return media.matches || iosStandalone
}

export const usePWA = () => {
	const [isPWA, setIsPWA] = useState<boolean>(checkPWA)

	useEffect(() => {
		const media = window.matchMedia("(display-mode: standalone)")

		const check = () => {
			setIsPWA(checkPWA())
		}

		media.addEventListener("change", check)

		return () => {
			media.removeEventListener("change", check)
		}
	}, [])

	return isPWA
}
