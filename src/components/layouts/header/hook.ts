import { ChevronLeftIcon, MoveLeftIcon } from "lucide-react"
import { usePathname } from "next/navigation"
import { useCallback, useRef, useState } from "react"

import { AppRoutes } from "@/libs/constants"
import { useIsIOS, useNavigation } from "@/libs/hooks"
import { useReduceMotion } from "@/libs/motion"

const paths = {
	[AppRoutes.MY_PROFILE]: "Мой профиль",
	[AppRoutes.SESSIONS]: "Мои сеансы",
	[AppRoutes.REQUESTS]: "Входящие заявки",
	[AppRoutes.SETTINGS]: "Настройки"
} as const

const BACK_ANIMATION_MS = 300

export const useNestedHeader = () => {
	const pathname = usePathname()
	const { back } = useNavigation()

	const reduceMotion = useReduceMotion()

	const isIOS = useIsIOS()

	const [isActive, setIsActive] = useState(false)

	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

	const handleBack = useCallback(() => {
		if (isIOS) return back()

		setIsActive(true)

		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current)
		}

		timeoutRef.current = setTimeout(() => {
			back()
			setIsActive(false)
			timeoutRef.current = null
		}, BACK_ANIMATION_MS)
	}, [isIOS, back])

	const title = paths[pathname as keyof typeof paths]

	const Icon = isIOS ? ChevronLeftIcon : MoveLeftIcon

	return { Icon, title, handleBack, reduceMotion, isIOS, isActive }
}
