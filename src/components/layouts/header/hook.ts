import { ChevronLeftIcon, MoveLeftIcon } from "lucide-react"
import { usePathname } from "next/navigation"
import { useState } from "react"

import { AppRoutes } from "@/libs/constants"
import { useIsIOS, useNavigation } from "@/libs/hooks"

const paths = {
	[AppRoutes.MY_PROFILE]: "Мой профиль",
	[AppRoutes.SESSIONS]: "Мои сеансы",
	[AppRoutes.REQUESTS]: "Входящие заявки"
} as const

export const useNestedHeader = () => {
	const pathname = usePathname()
	const { back } = useNavigation()

	const isIOS = useIsIOS()

	const [isActive, setIsActive] = useState(false)

	const handleBack = () => {
		if (isIOS) return back()

		setIsActive(true)
		setTimeout(() => {
			back()
			setIsActive(false)
		}, 300)
	}

	const title = paths[pathname as keyof typeof paths]

	const Icon = isIOS ? ChevronLeftIcon : MoveLeftIcon

	return { Icon, title, handleBack, isIOS, isActive }
}
