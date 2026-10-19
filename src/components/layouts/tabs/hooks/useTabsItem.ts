import {
	CircleQuestionMarkIcon,
	HomeIcon,
	InfoIcon,
	MenuIcon,
	PlayIcon
} from "lucide-react"
import { useMemo } from "react"

import { useNavigation } from "@/libs/hooks"

export type TabsItemIconType = "about" | "menu" | "start" | "home"

export const useTabsItem = (icon: TabsItemIconType) => {
	const { push } = useNavigation()

	const Icon = useMemo(() => {
		switch (icon) {
			case "about":
				return InfoIcon
			case "start":
				return PlayIcon
			case "menu":
				return MenuIcon
			case "home":
				return HomeIcon
			default:
				return CircleQuestionMarkIcon
		}
	}, [icon])

	return {
		push,
		Icon
	}
}
