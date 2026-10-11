import { GlobeIcon, MonitorIcon } from "lucide-react"

import type { SessionsHttpDtoSessionDtoMetadataDevice } from "@/api/generated"
import {
	BROWSERS,
	DEVICE_TYPES,
	OPERATING_SYSTEMS
} from "@/libs/constants/screens/sessions"
import { capitalize, formatDate } from "@/libs/utils"
import type { DeviceType, SessionParsedDevice } from "@/types/screens/sessions"

function normalizeBrowser(value?: string) {
	const key = value?.trim().toLowerCase() || "other"

	return (
		BROWSERS[key] ?? {
			name: capitalize(value || "Неизвестно"),
			icon: GlobeIcon
		}
	)
}

function normalizeOS(value?: string) {
	const key = value?.trim().toLowerCase() || "other"

	return (
		OPERATING_SYSTEMS[key] ?? {
			name: capitalize(value || "Неизвестно"),
			icon: MonitorIcon
		}
	)
}

function normalizeType(value?: string) {
	const key = value?.trim().toLowerCase() as DeviceType

	return DEVICE_TYPES[key] ?? DEVICE_TYPES.unknown
}

function normalizeModel(
	model: string | undefined,
	os: string | undefined,
	type: DeviceType
): string {
	if (!model || model === "unknown") {
		if (os === "ios") {
			switch (type) {
				case "phone":
					return "iPhone"

				case "tablet":
					return "iPad"
			}
		}

		return "Неизвестное устройство"
	}

	return model
}

export function parseDevice(
	device?: SessionsHttpDtoSessionDtoMetadataDevice
): SessionParsedDevice {
	const app = device?.app?.trim() || ""
	const os = device?.os?.trim().toLowerCase() || ""
	const type = (device?.type?.trim().toLowerCase() || "unknown") as DeviceType
	const model = device?.model?.trim() || ""
	const version = device?.vers?.trim() || ""

	const browser = normalizeBrowser(app)
	const operatingSystem = normalizeOS(os)
	const deviceType = normalizeType(type)

	const normalizedModel = normalizeModel(model, os, type)

	const parts: string[] = [browser.name, operatingSystem.name]

	if (version) {
		parts.push(`(${version})`)
	}

	return {
		browser,
		os: operatingSystem,
		type: deviceType,
		model: normalizedModel,
		version: version || "—",
		label: parts.join(" ")
	}
}

export function formatRelativeDate(value: string) {
	const date = new Date(value)

	if (Number.isNaN(date.getTime())) {
		return "неизвестно"
	}

	const diff = Date.now() - date.getTime()
	const minutes = Math.floor(diff / 60_000)

	if (minutes < 1) return "только что"

	if (minutes < 60) {
		return `${minutes} ${pluralize(minutes, "минуту", "минуты", "минут")} назад`
	}

	const hours = Math.floor(minutes / 60)

	if (hours < 24) {
		return `${hours} ${pluralize(hours, "час", "часа", "часов")} назад`
	}

	const days = Math.floor(hours / 24)

	if (days < 30) {
		return `${days} ${pluralize(days, "день", "дня", "дней")} назад`
	}

	return formatDate(value)
}

function pluralize(value: number, one: string, few: string, many: string) {
	const mod10 = value % 10
	const mod100 = value % 100

	if (mod10 === 1 && mod100 !== 11) {
		return one
	}

	if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) {
		return few
	}

	return many
}
