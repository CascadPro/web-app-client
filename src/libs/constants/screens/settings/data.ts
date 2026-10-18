import {
	BellRingIcon,
	FileTextIcon,
	SmartphoneIcon,
	TabletSmartphoneIcon
} from "lucide-react"

import type { SettingsNotificationRow } from "@/types/screens/settings"

export const SETTINGS_NOTIFICATIONS_ROWS: SettingsNotificationRow[] = [
	{
		key: "requests",
		title: "Заявки",
		description: "Новые входящие заявки",
		icon: FileTextIcon
	},
	{
		key: "sessions",
		title: "Сеансы",
		description: "Изменения активных сеансов",
		icon: TabletSmartphoneIcon
	},
	{
		key: "system",
		title: "Системные",
		description: "Важные события приложения",
		icon: BellRingIcon
	},
	{
		key: "push",
		title: "Push-уведомления",
		description: "Уведомления вне открытой страницы",
		icon: SmartphoneIcon
	}
]
