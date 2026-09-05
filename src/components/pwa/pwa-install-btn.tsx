"use client"

import { useEffect, useState } from "react"

import { Button } from "../ui"

interface BeforeInstallPromptEvent extends Event {
	prompt: () => Promise<void>
	userChoice: Promise<{
		outcome: "accepted" | "dismissed"
	}>
}

export function PWAInstallPrompt() {
	const [event, setEvent] = useState<BeforeInstallPromptEvent | null>(null)

	useEffect(() => {
		const handler = (event: Event) => {
			event.preventDefault()

			setEvent(event as BeforeInstallPromptEvent)
		}

		window.addEventListener("beforeinstallprompt", handler)

		return () => {
			window.removeEventListener("beforeinstallprompt", handler)
		}
	}, [])

	if (!event) {
		return null
	}

	const install = async () => {
		await event.prompt()

		const choice = await event.userChoice

		if (choice.outcome === "accepted") {
			setEvent(null)
		}
	}

	return (
		<Button variant="default" onClick={install}>
			Установить приложение
		</Button>
	)
}
