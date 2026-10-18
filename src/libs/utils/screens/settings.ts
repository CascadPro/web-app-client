import { DEFAULT_SETTINGS } from "@/libs/constants/screens/settings"

export const readSettings = () => {
	if (typeof window === "undefined") return DEFAULT_SETTINGS

	try {
		const raw = localStorage.getItem("cascade:settings:v1")
		if (!raw) return DEFAULT_SETTINGS

		const saved = JSON.parse(raw)
		const notifications = saved.notifications ?? {}

		return {
			...DEFAULT_SETTINGS,
			...saved,
			notifications: {
				...DEFAULT_SETTINGS.notifications,
				...notifications
			}
		}
	} catch {
		return DEFAULT_SETTINGS
	}
}

export const writeSettings = (value: unknown) => {
	try {
		localStorage.setItem("cascade:settings:v1", JSON.stringify(value))
	} catch {
		// Storage может быть недоступен в приватном режиме.
	}
}
