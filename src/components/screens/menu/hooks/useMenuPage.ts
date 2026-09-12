import {
	CircleUserRoundIcon,
	CogIcon,
	FileTextIcon,
	InfoIcon,
	type LucideIcon,
	TabletSmartphoneIcon
} from "lucide-react"
import { useMemo } from "react"

import { useLogout } from "@/libs/hooks/use-logout"
import { useAuthStore } from "@/store/auth"

export interface MenuPageItemData {
	title: string
	href: string
	icon: LucideIcon
}

export const useMenuPage = () => {
	const menuItemsData: MenuPageItemData[] = useMemo(
		() => [
			{
				title: "Профиль",
				href: "/profile/me",
				icon: CircleUserRoundIcon
			},
			{
				title: "Настройки",
				href: "/settings",
				icon: CogIcon
			},
			{
				title: "Сеансы",
				href: "/sessions",
				icon: TabletSmartphoneIcon
			},
			{
				title: "Входящие заявки",
				href: "/requests",
				icon: FileTextIcon
			},
			{
				title: "О нас",
				href: "/about",
				icon: InfoIcon
			}
		],
		[]
	)

	const user = useAuthStore(state => state.user)
	const status = useAuthStore(state => state.status)

	const logout = useLogout()

	const fullname = useMemo(() => {
		return `${user?.name ?? ""} ${user?.surname ?? ""} ${user?.last_name ?? ""}`
	}, [user?.name, user?.surname, user?.last_name])

	return {
		menuItemsData,
		fullname,
		user,
		logout,
		loading: status === "loading"
	}
}
