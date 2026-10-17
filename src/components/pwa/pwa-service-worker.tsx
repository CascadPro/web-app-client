"use client"

import { useEffect, useRef, useState } from "react"

export function ServiceWorkerRegister() {
	const [updateAvailable, setUpdateAvailable] = useState(false)
	const [dismissed, setDismissed] = useState(false)

	const waitingWorker = useRef<ServiceWorker | null>(null)
	const shouldReload = useRef(false)

	useEffect(() => {
		if (
			process.env.NODE_ENV !== "production" ||
			!("serviceWorker" in navigator)
		) {
			return
		}

		let disposed = false
		let registration: ServiceWorkerRegistration | undefined
		let updateInterval: number | undefined

		const detectWaitingWorker = () => {
			if (registration?.waiting && navigator.serviceWorker.controller) {
				waitingWorker.current = registration.waiting
				setUpdateAvailable(true)
			}
		}

		const onControllerChange = () => {
			if (shouldReload.current) {
				window.location.reload()
			}
		}

		const onUpdateFound = () => {
			const installing = registration?.installing

			if (!installing) return

			installing.addEventListener("statechange", () => {
				if (
					installing.state === "installed" &&
					navigator.serviceWorker.controller &&
					registration?.waiting
				) {
					waitingWorker.current = registration.waiting
					setDismissed(false)
					setUpdateAvailable(true)
				}
			})
		}

		const onVisibilityChange = () => {
			if (document.visibilityState === "visible" && registration) {
				void registration.update().catch(() => {})
			}
		}

		navigator.serviceWorker.addEventListener(
			"controllerchange",
			onControllerChange
		)

		void navigator.serviceWorker
			.register("/sw.js", {
				scope: "/",
				updateViaCache: "none"
			})
			.then(result => {
				if (disposed) return

				registration = result

				detectWaitingWorker()

				registration.addEventListener("updatefound", onUpdateFound)

				// Проверяем обновления не чаще одного раза в час.
				updateInterval = window.setInterval(
					() => {
						void registration?.update().catch(() => {})
					},
					60 * 60 * 1000
				)

				document.addEventListener("visibilitychange", onVisibilityChange)
			})
			.catch(error => {
				console.error("[PWA] Service Worker registration failed:", error)
			})

		return () => {
			disposed = true

			navigator.serviceWorker.removeEventListener(
				"controllerchange",
				onControllerChange
			)

			document.removeEventListener("visibilitychange", onVisibilityChange)

			if (updateInterval !== undefined) {
				window.clearInterval(updateInterval)
			}

			registration?.removeEventListener("updatefound", onUpdateFound)
		}
	}, [])

	const applyUpdate = () => {
		const worker = waitingWorker.current

		if (!worker) return

		shouldReload.current = true
		worker.postMessage({ type: "SKIP_WAITING" })
	}

	if (!updateAvailable || dismissed) {
		return null
	}

	return (
		<aside
			role="status"
			aria-live="polite"
			className="fixed inset-x-3 z-100 mx-auto flex max-w-lg items-center gap-3 rounded-2xl border border-white/10 bg-neutral-900/95 p-4 text-sm text-white shadow-2xl backdrop-blur-xl"
			style={{
				bottom: "calc(1rem + env(safe-area-inset-bottom, 0px))"
			}}
		>
			<div className="min-w-0 flex-1">
				<p className="font-semibold">Доступна новая версия</p>
				<p className="mt-1 text-neutral-400">
					Обнови Cascade Pro, чтобы применить изменения.
				</p>
			</div>

			<button
				type="button"
				onClick={applyUpdate}
				className="shrink-0 rounded-xl bg-blue-400 px-3 py-2 font-semibold text-neutral-950"
			>
				Обновить
			</button>

			<button
				type="button"
				onClick={() => setDismissed(true)}
				aria-label="Позже"
				className="shrink-0 rounded-lg px-2 py-2 text-neutral-400"
			>
				Позже
			</button>
		</aside>
	)
}
