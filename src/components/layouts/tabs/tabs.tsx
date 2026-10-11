import type { FC } from "react"

import type { AppRoutesKeys } from "@/libs/constants"

import { TabsItem } from "./components/tabs-item"
import type { TabsItemIconType } from "./hooks/useTabsItem"

export interface TabsData {
	title: string
	icon: TabsItemIconType
	href: AppRoutesKeys
}

interface Props {
	data: TabsData[]
}

export const Tabs: FC<Props> = ({ data }) => {
	return (
		<nav className="bg-background/40 border-outline/20 pwa:pb-4 fixed bottom-0 left-0 z-50 grid min-h-18 w-full auto-cols-fr grid-flow-col border-t py-3 backdrop-blur-lg">
			{data.map(tab => (
				<TabsItem key={tab.href} {...tab} />
			))}
		</nav>
	)
}
