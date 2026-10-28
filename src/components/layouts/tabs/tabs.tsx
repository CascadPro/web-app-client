"use client"

import { m } from "motion/react"
import { type FC, memo } from "react"

import type { AppRoutesKeys } from "@/libs/constants"
import { cn } from "@/libs/utils"

import { TabsItem } from "./components/tabs-item"
import { useTabs } from "./hooks/useTabs"
import type { TabsItemIconType } from "./hooks/useTabsItem"

export interface TabsData {
	title: string
	icon: TabsItemIconType
	href: AppRoutesKeys
}

interface Props {
	data: TabsData[]
}

const TabsComponent: FC<Props> = ({ data }) => {
	const { isIOS, scale, currentIndex, onTabClick } = useTabs(data)

	return (
		<nav
			className={cn("fixed z-50 flex", {
				"glass pwa:bottom-4 bottom-2 left-1/2 min-h-14 w-fit -translate-x-1/2 gap-1 rounded-4xl p-1":
					isIOS,
				"bg-background/40 border-outline/20 pwa:pb-4 bottom-0 left-0 min-h-18 w-full border-t py-3 backdrop-blur-lg":
					!isIOS
			})}
		>
			{isIOS && currentIndex >= 0 && (
				<m.div
					initial={{ opacity: 0 }}
					animate={{
						x: `${7.25 * currentIndex}rem`,
						opacity: 1,
						scaleY: scale
					}}
					transition={{
						type: "spring",
						damping: 32,
						stiffness: 500,
						mass: 1.3
					}}
					className="glass bg-primary/15! absolute top-1/2 h-14 w-28 -translate-y-1/2 rounded-4xl"
				></m.div>
			)}

			{data.map((tab, i) => (
				<TabsItem
					key={tab.href}
					active={i === currentIndex}
					isIOS={isIOS}
					onClick={() => onTabClick(i)}
					{...tab}
				/>
			))}
		</nav>
	)
}

export const Tabs = memo(TabsComponent)
Tabs.displayName = "Tabs"
