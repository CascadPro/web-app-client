"use client"

import { memo } from "react"

import { Button, Title } from "@/components/ui"

const OfflineScreenComponent = () => {
	return (
		<main className="flex min-h-screen items-center justify-center">
			<div className="text-center">
				<Title size="lg">Нет подключения</Title>

				<p className="text-on-surface-variant mt-2">
					Проверь интернет и попробуй снова
				</p>

				<Button
					variant="default"
					className="mt-6 rounded-md border px-4 py-2"
					onClick={() => location.reload()}
				>
					Повторить
				</Button>
			</div>
		</main>
	)
}

export const OfflineScreen = memo(OfflineScreenComponent)
OfflineScreen.displayName = "OfflineScreen"
