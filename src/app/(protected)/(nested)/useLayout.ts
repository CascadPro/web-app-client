import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"

import { AppRoutes } from "@/libs/constants"
import { useSwipe } from "@/libs/hooks"

const paths = {
	[AppRoutes.MY_PROFILE]: "Мой профиль",
	[AppRoutes.SESSIONS]: "Мои сеансы",
	[AppRoutes.REQUESTS]: "Входящие заявки"
} as const

export const useNestedLayout = () => {
	const pathname = usePathname()
	const { back } = useRouter()

	const [isActive, setIsActive] = useState(false)

	const handleBack = () => {
		setIsActive(true)
		setTimeout(() => {
			back()
			setIsActive(false)
		}, 500)
	}

	const title = paths[pathname as keyof typeof paths]

	useSwipe({
		onSwipeRight: handleBack,
		threshold: 0.3,
		edgeThreshold: 128
	})

	return { title, handleBack, isActive }
}
