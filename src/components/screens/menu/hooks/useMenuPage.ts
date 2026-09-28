import {
	CircleUserRoundIcon,
	CogIcon,
	FileTextIcon,
	InfoIcon,
	type LucideIcon,
	TabletSmartphoneIcon
} from "lucide-react"
import { useMemo } from "react"

import { AppRoutes, type AppRoutesKeys } from "@/libs/constants"
import { useLogout } from "@/libs/hooks/use-logout"
import { useCurrentUser } from "@/libs/query/hooks"
import { useAuthStore } from "@/store/auth"

export interface MenuPageItemData {
	title: string
	href: AppRoutesKeys
	icon: LucideIcon
}

export const useMenuPage = () => {
	const menuItemsData: MenuPageItemData[] = useMemo(
		() => [
			{
				title: "Профиль",
				href: AppRoutes.MY_PROFILE,
				icon: CircleUserRoundIcon
			},
			{
				title: "Настройки",
				href: AppRoutes.INDEX,
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
		],
		[]
	)

	const status = useAuthStore(state => state.status)

	const { data: user } = useCurrentUser()

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
