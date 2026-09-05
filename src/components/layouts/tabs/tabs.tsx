import { type FC } from "react"

import { AppRoutes } from "@/libs/constants"

import { TabsItem, type TabsItemIconType } from "./components/tabs-item"

interface Props {
	auth?: boolean
}

interface Data {
	title: string
	icon: TabsItemIconType
	href: AppRoutes
	auth?: boolean
}

export const Tabs: FC<Props> = ({ auth = false }) => {
	const pages: Data[] = [
		{
			title: "Дом",
			icon: "home",
			href: AppRoutes.INDEX,
			auth: true
		},
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

	return (
		<nav className="bg-background border-on-secondary-container/50 fixed bottom-0 left-0 grid w-full auto-cols-fr grid-flow-col border-t py-3 shadow">
			{pages
				.filter(t => !!t.auth === auth)
				.map(tab => (
					<TabsItem key={tab.href} {...tab} />
				))}
		</nav>
	)
}
