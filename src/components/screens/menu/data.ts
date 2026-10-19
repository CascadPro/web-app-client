import {
	CircleUserRoundIcon,
	CogIcon,
	FileTextIcon,
	InfoIcon,
	type LucideIcon,
	TabletSmartphoneIcon
} from "lucide-react"

import { AppRoutes, type AppRoutesKeys } from "@/libs/constants"

export interface MenuPageItemData {
	title: string
	href: AppRoutesKeys
	icon: LucideIcon
}

export const MENU_ITEMS_DATA: MenuPageItemData[] = [
	{
		title: "Профиль",
		href: AppRoutes.MY_PROFILE,
		icon: CircleUserRoundIcon
	},
	{
		title: "Настройки",
		href: AppRoutes.SETTINGS,
		icon: CogIcon
	},
	{
		title: "Сеансы",
		href: AppRoutes.SESSIONS,
		icon: TabletSmartphoneIcon
	},
	{
		title: "Входящие заявки",
		href: AppRoutes.REQUESTS,
		icon: FileTextIcon
	},
	{
		title: "О нас",
		href: AppRoutes.ABOUT,
		icon: InfoIcon
	}
]
