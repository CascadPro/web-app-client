"use client"

import { Button, Title } from "@/components/ui"

export default function Offline() {
	return (
		<main className="flex min-h-screen items-center justify-center">
			<div className="text-center">
				<Title size="lg">Нет подключения</Title>

				<p className="text-muted-foreground mt-2">
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
