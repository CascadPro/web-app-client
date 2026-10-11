import { useReducedMotion } from "motion/react"
import { usePathname, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"

const NAVIGATION_TIMEOUT = 10_000
const SLOW_NAVIGATION_DELAY = 500

export const useNavigationProgress = () => {
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const reducedMotion = useReducedMotion()

	const [isLoading, setIsLoading] = useState(false)
	const [isSlow, setIsSlow] = useState(false)

	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
	const slowTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
	const previousUrlRef = useRef<string | null>(null)

	const clearTimers = useCallback(() => {
		if (timeoutRef.current) clearTimeout(timeoutRef.current)
		if (slowTimeoutRef.current) clearTimeout(slowTimeoutRef.current)

		timeoutRef.current = null
		slowTimeoutRef.current = null
	}, [])

	const finishNavigation = useCallback(() => {
		clearTimers()
		setIsLoading(false)
		setIsSlow(false)
	}, [clearTimers])

	const startNavigation = useCallback(() => {
		clearTimers()
		setIsLoading(true)
		setIsSlow(false)

		slowTimeoutRef.current = setTimeout(() => {
			setIsSlow(true)
		}, SLOW_NAVIGATION_DELAY)

		timeoutRef.current = setTimeout(() => {
			finishNavigation()
		}, NAVIGATION_TIMEOUT)
	}, [clearTimers, finishNavigation])

	useEffect(() => {
		const handleClick = (event: MouseEvent) => {
			if (
				event.defaultPrevented ||
				event.button !== 0 ||
				event.metaKey ||
				event.ctrlKey ||
				event.shiftKey ||
				event.altKey
			) {
				return
			}

			const target = event.target
			if (!(target instanceof Element)) return

			const link = target.closest("a[href]")
			if (!(link instanceof HTMLAnchorElement)) return

			if (
				link.hasAttribute("download") ||
				link.target === "_blank" ||
				Object.hasOwn(link.dataset, "noProgress")
			) {
				return
			}

			const url = new URL(link.href, window.location.href)

			if (url.origin !== window.location.origin) return

			if (
				url.pathname === window.location.pathname &&
				url.search === window.location.search
			) {
				return
			}

			startNavigation()
		}

		const handleStartEvent = () => startNavigation()

		document.addEventListener("click", handleClick, true)
		window.addEventListener("cascade:navigation-start", handleStartEvent)

		return () => {
			document.removeEventListener("click", handleClick, true)
			window.removeEventListener("cascade:navigation-start", handleStartEvent)
		}
	}, [startNavigation])

	const search = searchParams.toString()
	const currentUrl = `${pathname}?${search}`

	useEffect(() => {
		if (previousUrlRef.current === null) {
			previousUrlRef.current = currentUrl
			return
		}

		if (previousUrlRef.current !== currentUrl) {
			previousUrlRef.current = currentUrl
			finishNavigation()
		}
	}, [currentUrl, finishNavigation])

	useEffect(() => {
		return clearTimers
	}, [clearTimers])

	return {
		reducedMotion,
		isLoading,
		isSlow
	}
}
