import { usePathname } from "next/navigation"
import { useState } from "react"

import { AppRoutes } from "@/libs/constants"
import { useNavigation } from "@/libs/hooks"

const paths = {
	[AppRoutes.MY_PROFILE]: "Мой профиль",
	[AppRoutes.SESSIONS]: "Мои сеансы",
	[AppRoutes.REQUESTS]: "Входящие заявки"
} as const

export const useNestedLayout = () => {
	const pathname = usePathname()
	const { back } = useNavigation()

	const [isActive, setIsActive] = useState(false)

	const handleBack = () => {
		setIsActive(true)
		setTimeout(() => {
			back()
			setIsActive(false)
		}, 500)
	}

	const title = paths[pathname as keyof typeof paths]

	return { title, handleBack, isActive }
}
