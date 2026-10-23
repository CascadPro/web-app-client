"use client"

import { useCallback, useEffect, useRef, useState } from "react"

export const usePWAServiceWorker = () => {
	const [updateAvailable, setUpdateAvailable] = useState(false)
	const [dismissed, setDismissed] = useState(false)

	const waitingWorker = useRef<ServiceWorker | null>(null)
	const shouldReload = useRef(false)

	useEffect(() => {
		const isProduction = process.env.NODE_ENV === "production"
		const hasNavigator = typeof navigator !== "undefined"
		const hasServiceWorker = hasNavigator && "serviceWorker" in navigator
		const isSecureContext = window.isSecureContext

		if (isProduction || !hasServiceWorker || !isSecureContext) {
			return
		}

		let disposed = false
		let registration: ServiceWorkerRegistration | undefined
		let updateInterval: number | undefined
		let installingWorker: ServiceWorker | null = null

		const showUpdate = (worker: ServiceWorker) => {
			if (disposed) return

			waitingWorker.current = worker
			setDismissed(false)
			setUpdateAvailable(true)
		}

		const detectWaitingWorker = () => {
			const waiting = registration?.waiting

			if (waiting && navigator.serviceWorker.controller) {
				showUpdate(waiting)
			}
		}

		const onControllerChange = () => {
			if (shouldReload.current) {
				window.location.reload()
			}
		}

		const onInstallingStateChange = () => {
			if (installingWorker?.state !== "installed") {
				return
			}

			if (!navigator.serviceWorker.controller) return

			const waiting = registration?.waiting

			if (waiting) {
				showUpdate(waiting)
				return
			}

			queueMicrotask(detectWaitingWorker)
		}

		const onUpdateFound = () => {
			installingWorker?.removeEventListener(
				"statechange",
				onInstallingStateChange
			)

			installingWorker = registration?.installing ?? null

			if (!installingWorker) return

			installingWorker.addEventListener("statechange", onInstallingStateChange)

			onInstallingStateChange()
		}

		const checkForUpdates = () => {
			if (document.visibilityState === "hidden" || !registration) {
				return
			}

			void registration
				.update()
				.then(() => {
					detectWaitingWorker()
				})
				.catch((error: unknown) => {
					const message = error instanceof Error ? error.message : String(error)

					console.warn("[PWA] Update check failed:", message)
				})
		}

		const onVisibilityChange = () => {
			checkForUpdates()
		}

		const onPageShow = () => {
			checkForUpdates()
		}

		const onFocus = () => {
			checkForUpdates()
		}

		navigator.serviceWorker.addEventListener(
			"controllerchange",
			onControllerChange
		)

		const register = async () => {
			try {
				registration = await navigator.serviceWorker.register("/sw.js", {
					scope: "/",
					updateViaCache: "none"
				})

				if (disposed) return

				registration.addEventListener("updatefound", onUpdateFound)

				detectWaitingWorker()

				await registration.update().catch((error: unknown) => {
					console.warn("[PWA] Update check failed:", error)
				})

				if (disposed) return

				detectWaitingWorker()

				updateInterval = window.setInterval(checkForUpdates, 15 * 60 * 1000)

				document.addEventListener("visibilitychange", onVisibilityChange)

				window.addEventListener("pageshow", onPageShow)
				window.addEventListener("focus", onFocus)
			} catch (error) {
				console.error("[PWA] Service Worker registration failed:", error)
			}
		}

		void register()

		return () => {
			disposed = true

			navigator.serviceWorker.removeEventListener(
				"controllerchange",
				onControllerChange
			)

			document.removeEventListener("visibilitychange", onVisibilityChange)

			window.removeEventListener("pageshow", onPageShow)
			window.removeEventListener("focus", onFocus)

			if (updateInterval !== undefined) {
				window.clearInterval(updateInterval)
			}

			registration?.removeEventListener("updatefound", onUpdateFound)

			installingWorker?.removeEventListener(
				"statechange",
				onInstallingStateChange
			)
		}
	}, [])

	useEffect(() => {
		const root = document.documentElement
		const selector = 'meta[name="theme-color"]'

		let meta = document.querySelector<HTMLMetaElement>(selector)

		if (!meta) {
			meta = document.createElement("meta")
			meta.name = "theme-color"
			document.head.appendChild(meta)
		}

		const updateThemeColor = () => {
			const background = getComputedStyle(root)
				.getPropertyValue("--background")
				.trim()

			if (background && meta) {
				meta.content = background
			}
		}

		updateThemeColor()

		const observer = new MutationObserver(updateThemeColor)

		observer.observe(root, {
			attributes: true,
			attributeFilter: ["class", "style", "data-theme"]
		})

		return () => observer.disconnect()
	}, [])

	const applyUpdate = useCallback(() => {
		const worker = waitingWorker.current

		if (worker?.state !== "installed") return

		shouldReload.current = true
		worker.postMessage({ type: "SKIP_WAITING" })
	}, [])

	const dismissUpdate = useCallback(() => {
		setDismissed(true)
	}, [])

	return {
		updateAvailable,
		dismissed,
		applyUpdate,
		dismissUpdate
	}
}
