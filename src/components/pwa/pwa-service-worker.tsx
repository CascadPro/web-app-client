"use client"

import { RotateCcwClockIcon } from "lucide-react"

import { Button, Title } from "../ui"

import { usePWAServiceWorker } from "./hooks/usePWAServiceWorker"

export function ServiceWorkerRegister() {
	const { updateAvailable, dismissed, applyUpdate, dismissUpdate } =
		usePWAServiceWorker()

	if (!updateAvailable || dismissed) {
		return null
	}

	return (
		<div className="pointer-events-none fixed bottom-4 z-200 w-full px-4">
			<aside
				role="status"
				aria-live="polite"
				aria-label="Доступна новая версия"
				className="glass-thick glass-highlight pointer-events-auto mx-auto flex max-w-lg flex-col gap-5 rounded-2xl p-4"
			>
				<div className="flex min-w-0 items-start gap-3">
					<span className="bg-primary/20 text-primary mt-1.5 rounded-lg p-2">
						<RotateCcwClockIcon size={24} />
					</span>

					<div>
						<Title size="md" className="text-on-surface">
							Доступна новая версия
						</Title>

						<p className="text-on-surface-variant text-sm">
							Обновите приложение, чтобы получить последние изменения.
						</p>
					</div>
				</div>

				<div className="flex items-center gap-3 self-end">
					<Button
						variant="ghost"
						className="text-on-surface-variant hover:text-on-surface active:text-on-surface active:bg-primary/20 rounded-xl px-3 py-2 text-sm transition-colors"
						onClick={dismissUpdate}
					>
						Позже
					</Button>

					<Button
						variant="default-2"
						className="px-3 py-2"
						onClick={applyUpdate}
					>
						Обновить
					</Button>
				</div>
			</aside>
		</div>
	)
}
