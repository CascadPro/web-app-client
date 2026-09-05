import {
	HomeIcon,
	InfoIcon,
	LucideIcon,
	MenuIcon,
	PlayIcon
} from "lucide-react"
import { usePathname, useRouter } from "next/navigation"

import { TabsItemIconType } from "../components/tabs-item"

export const useTabsItem = (href: string, icon: TabsItemIconType) => {
	const pathname = usePathname()
	const active = pathname === href

	const { push } = useRouter()

	let Icon: LucideIcon
	switch (icon) {
		case "about":
			Icon = InfoIcon
			break
		case "menu":
			Icon = MenuIcon
			break
		case "start":
			Icon = PlayIcon
			break
		default:
			Icon = HomeIcon
	}

	return {
		handleClick: () => push(href),
		active,
		Icon
	}
}
