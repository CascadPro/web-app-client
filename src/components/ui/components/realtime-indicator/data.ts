import {
	AlertCircleIcon,
	RefreshCwIcon,
	ShieldCheckIcon,
	WifiIcon,
	WifiOffIcon
} from "lucide-react"

export const STATUS_CONFIG = {
	idle: {
		label: "Ожидание подключения",
		description: "Realtime не запущен",
		color: "text-on-surface",
		textColor: "text-on-surface/80",
		icon: WifiOffIcon,
		pulse: false
	},
	connecting: {
		label: "Подключение",
		description: "Устанавливаем соединение",
		color: "bg-primary",
		textColor: "text-primary",
		icon: WifiIcon,
		pulse: true
	},
	authorizing: {
		label: "Авторизация",
		description: "Проверяем сессию",
		color: "bg-primary",
		textColor: "text-primary",
		icon: ShieldCheckIcon,
		pulse: true
	},
	online: {
		label: "Подключено",
		description: "Все события синхронизируются",
		color: "bg-emerald-500",
		textColor: "text-emerald-400",
		icon: WifiIcon,
		pulse: true
	},
	reconnecting: {
		label: "Переподключение",
		description: "Восстанавливаем соединение",
		color: "bg-primary",
		textColor: "text-primary",
		icon: RefreshCwIcon,
		pulse: false
	},
	offline: {
		label: "Нет соединения",
		description: "Ожидаем подключения",
		color: "text-on-surface",
		textColor: "text-on-surface/80",
		icon: WifiOffIcon,
		pulse: false
	},
	error: {
		label: "Ошибка соединения",
		description: "Не удалось подключиться",
		color: "bg-red-400",
		textColor: "text-red-300",
		icon: AlertCircleIcon,
		pulse: false
	}
} as const
