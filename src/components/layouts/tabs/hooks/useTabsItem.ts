import {
	CircleQuestionMarkIcon,
	HomeIcon,
	InfoIcon,
	LucideIcon,
	MenuIcon,
	PlayIcon
} from "lucide-react"
import { usePathname, useRouter } from "next/navigation"

export type TabsItemIconType = "about" | "menu" | "start" | "home"

export const useTabsItem = (href: string, icon: TabsItemIconType) => {
	const pathname = usePathname()
	const active = pathname === href

	const { push } = useRouter()

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
