import { GlobeIcon, MonitorIcon } from "lucide-react"

import type { SessionsHttpDtoSessionDtoMetadataDevice } from "@/api/generated"
import { BROWSERS, DEVICE_TYPES, OPERATING_SYSTEMS } from "@/libs/constants"
import { capitalize } from "@/libs/utils"
import type { DeviceType, SessionParsedDevice } from "@/types/base"

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
