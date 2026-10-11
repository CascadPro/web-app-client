import type { LucideIcon } from "lucide-react"

export type DeviceType = "phone" | "tablet" | "desktop" | "unknown"

export type BrowserName =
	| "Chrome"
	| "Firefox"
	| "Safari"
	| "Edge"
	| "Opera"
	| "Postman"
	| "Другой браузер"
	| "Неизвестно"

export type OSName =
	"Windows" | "macOS" | "Linux" | "Android" | "iOS" | "Другая ОС" | "Неизвестно"

export type SessionBrowser = {
	name: BrowserName
	icon: LucideIcon
}

export type SessionOperatingSystem = {
	name: OSName
	icon: LucideIcon
}

export type SessionDeviceType = {
	name: string
	icon: LucideIcon
}

export interface SessionParsedDevice {
	browser: SessionBrowser
	os: SessionOperatingSystem
	type: SessionDeviceType

	model: string
	version: string

	/**
	 * Готовая строка для отображения.
	 *
	 * Например:
	 * "Safari iOS (26.5.2)"
	 */
	label: string
}
