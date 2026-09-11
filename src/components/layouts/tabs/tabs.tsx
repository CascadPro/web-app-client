import type { FC } from "react"

import { AppRoutes } from "@/libs/constants"

import { TabsItem } from "./components/tabs-item"
import type { TabsItemIconType } from "./hooks/useTabsItem"

interface Props {
	data: Data[]
}

interface Data {
	title: string
	icon: TabsItemIconType
	href: AppRoutes
}

export const Tabs: FC<Props> = ({ data }) => {
	return (
		<nav className="bg-background border-outline/20 shadow-outline fixed bottom-0 left-0 grid min-h-18 w-full auto-cols-fr grid-flow-col border-t py-3 shadow-xl">
			{data.map(tab => (
				<TabsItem key={tab.href} {...tab} />
			))}
		</nav>
	)
}
