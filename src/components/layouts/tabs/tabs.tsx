"use client"

import { type FC, memo } from "react"

import type { AppRoutesKeys } from "@/libs/constants"
import { useIsIOS } from "@/libs/hooks"
import { cn } from "@/libs/utils"

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

export const Tabs: FC<Props> = memo(({ data }) => {
	const isIOS = useIsIOS()

	return (
		<nav
			className={cn("fixed z-50 grid auto-cols-fr grid-flow-col", {
				"glass pwa:bottom-4 bottom-2 left-1/2 min-h-14 w-fit -translate-x-1/2 gap-1 rounded-4xl p-1":
					isIOS,
				"bg-background/40 border-outline/20 pwa:pb-4 bottom-0 left-0 min-h-18 w-full border-t py-3 backdrop-blur-lg":
					!isIOS
			})}
		>
			{data.map(tab => (
				<TabsItem key={tab.href} isIOS={isIOS} {...tab} />
			))}
		</nav>
	)
})
