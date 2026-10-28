import type { ReactNode } from "react"

import { Tabs, type TabsData } from "@/components/layouts/tabs/tabs"
import { Container } from "@/components/ui"
import { AppRoutes } from "@/libs/constants"
import { getViewport } from "@/libs/utils"

export const viewport = getViewport(false, 1)

const ROOT_TABS_DATA: TabsData[] = [
	{
		title: "О нас",
		icon: "about",
		href: AppRoutes.ABOUT
	},
	{
		title: "Начать",
		icon: "start",
		href: AppRoutes.START
	}
]

export default function Layout({
	children
}: Readonly<{ children: ReactNode }>) {
	return (
		<main>
			<Container className="px-3 py-2">{children}</Container>

			<Tabs data={ROOT_TABS_DATA} />
		</main>
	)
}
