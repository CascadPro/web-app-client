import {
	CircleQuestionMarkIcon,
	HomeIcon,
	InfoIcon,
	LucideIcon,
	MenuIcon,
	PlayIcon
} from "lucide-react"
import { usePathname } from "next/navigation"

import { useNavigation } from "@/libs/hooks"

export type TabsItemIconType = "about" | "menu" | "start" | "home"

export const useTabsItem = (href: string, icon: TabsItemIconType) => {
	const pathname = usePathname()
	const active = pathname === href

	const { push } = useNavigation()

	let Icon: LucideIcon
	switch (icon) {
		case "about":
			Icon = InfoIcon
			break
		case "start":
			Icon = PlayIcon
			break
		case "menu":
			Icon = MenuIcon
			break
		case "home":
			Icon = HomeIcon
			break
		default:
			Icon = CircleQuestionMarkIcon
	}

	return {
		handleClick: () => push(href),
		active,
		Icon
	}
}
