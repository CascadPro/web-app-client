import {
	SiAndroid,
	SiApple,
	SiFirefox,
	SiGooglechrome,
	SiLinux,
	SiOpera,
	SiPostman,
	SiSafari
} from "@icons-pack/react-simple-icons"
import {
	GlobeIcon,
	MonitorIcon,
	SmartphoneIcon,
	TabletIcon
} from "lucide-react"

import type {
	DeviceType,
	SessionBrowser,
	SessionDeviceType,
	SessionOperatingSystem
} from "@/types/base"

export const BROWSERS: Record<string, SessionBrowser> = {
	chrome: {
		name: "Chrome",
		icon: SiGooglechrome
	},
	firefox: {
		name: "Firefox",
		icon: SiFirefox
	},
	safari: {
		name: "Safari",
		icon: SiSafari
	},
	edge: {
		name: "Edge",
		icon: GlobeIcon
	},
	opera: {
		name: "Opera",
		icon: SiOpera
	},
	postman: {
		name: "Postman",
		icon: SiPostman
	},
	other: {
		name: "Другой браузер",
		icon: GlobeIcon
	}
}

export const OPERATING_SYSTEMS: Record<string, SessionOperatingSystem> = {
	windows: {
		name: "Windows",
		icon: MonitorIcon
	},

	macos: {
		name: "macOS",
		icon: SiApple
	},

	linux: {
		name: "Linux",
		icon: SiLinux
	},

	android: {
		name: "Android",
		icon: SiAndroid
	},

	ios: {
		name: "iOS",
		icon: SiApple
	},

	other: {
		name: "Другая ОС",
		icon: MonitorIcon
	}
}

export const DEVICE_TYPES: Record<DeviceType, SessionDeviceType> = {
	phone: {
		name: "Телефон",
		icon: SmartphoneIcon
	},

	tablet: {
		name: "Планшет",
		icon: TabletIcon
	},

	desktop: {
		name: "Компьютер",
		icon: MonitorIcon
	},

	unknown: {
		name: "Неизвестно",
		icon: MonitorIcon
	}
}
