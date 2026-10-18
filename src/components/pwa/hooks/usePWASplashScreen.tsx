import { useReducedMotion } from "motion/react"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

import { useAppReadinessStore } from "@/store/app-readiness"
import { useAuthStore } from "@/store/auth"

const protectedPrefixes = ["/menu", "/sessions", "/requests", "/profile"]

function isProtectedPath(pathname: string) {
	return (
		pathname === "/" ||
		protectedPrefixes.some(
			path => pathname === path || pathname.startsWith(`${path}/`)
		)
	)
}

export const usePWASplashScreen = () => {
	const pathname = usePathname()
	const status = useAuthStore(state => state.status)
	const queryRestored = useAppReadinessStore(state => state.queryRestored)
	const reduceMotion = useReducedMotion()

	const [clientMounted, setClientMounted] = useState(false)
	const [dismissed, setDismissed] = useState(false)

	useEffect(() => {
		setClientMounted(true)
	}, [])

	const needsInitialization = isProtectedPath(pathname)

	const ready =
		clientMounted &&
		(!needsInitialization || (queryRestored && status !== "loading"))

	useEffect(() => {
		if (ready) {
			setDismissed(true)
		}
	}, [ready])

	return {
		reduceMotion,
		dismissed
	}
}
