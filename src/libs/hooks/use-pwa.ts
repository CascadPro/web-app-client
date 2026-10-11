import { useEffect, useState } from "react"

type PWANavigator = Navigator & { standalone?: boolean }

export const usePWA = () => {
	const [isPWA, setIsPWA] = useState<boolean>(false)

	useEffect(() => {
		const media = window.matchMedia("(display-mode: standalone)")

		const check = () => {
			const iosStandalone =
				"standalone" in navigator &&
				(navigator as PWANavigator).standalone === true

			setIsPWA(media.matches || iosStandalone)
		}

		media.addEventListener("change", check)

		return () => {
			media.removeEventListener("change", check)
		}
	}, [])

	return isPWA
}
