"use client"

import { LoaderIcon } from "lucide-react"
import { AnimatePresence, m } from "motion/react"
import { Suspense } from "react"

import { useNavigationProgress } from "./hooks/useNavigationProgress"

function NavigationProgressInner() {
	const { reducedMotion, isLoading, isSlow } = useNavigationProgress()

	return (
		<>
			<AnimatePresence>
				{isLoading && (
					<m.div
						key="navigation-progress"
						aria-hidden="true"
						className="pointer-events-none fixed inset-x-0 top-0 z-9999 h-0.5 overflow-hidden"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: reducedMotion ? 0 : 0.18 }}
					>
						<m.div
							className="bg-primary h-full w-1/3 rounded-full"
							animate={
								reducedMotion
									? { x: "0%", width: "100%" }
									: { x: ["-100%", "300%"] }
							}
							transition={
								reducedMotion
									? { duration: 0 }
									: { duration: 1.1, repeat: Infinity, ease: "easeInOut" }
							}
						/>
					</m.div>
				)}
			</AnimatePresence>

			<AnimatePresence>
				{isLoading && isSlow && (
					<m.div
						key="navigation-indicator"
						role="status"
						aria-live="polite"
						aria-label="Загрузка страницы"
						className="pointer-events-none fixed inset-0 z-9998 flex items-center justify-center"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: reducedMotion ? 0 : 0.2 }}
					>
						<m.div
							className="ring-outline/20 bg-background/40 text-on-background flex items-center gap-2 rounded-2xl px-4 py-3 text-sm shadow-xl ring-2 backdrop-blur-xl"
							initial={reducedMotion ? false : { y: 6, scale: 0.98 }}
							animate={{ y: 0, scale: 1 }}
							exit={reducedMotion ? undefined : { y: 4, scale: 0.98 }}
						>
							<LoaderIcon size={18} className="animate-spin" />
							Переходим…
						</m.div>
					</m.div>
				)}
			</AnimatePresence>
		</>
	)
}

export function NavigationProgress() {
	return (
		<Suspense fallback={null}>
			<NavigationProgressInner />
		</Suspense>
	)
}
