"use client"

import type { FC } from "react"

import { Button } from "@/components/ui"

import { type TabsItemIconType, useTabsItem } from "../hooks/useTabsItem"

interface Props {
	title: string
	href: string
	icon: TabsItemIconType
}

export const TabsItem: FC<Props> = ({ title, href, icon }) => {
	const { Icon, active, handleClick } = useTabsItem(href, icon)

	return (
		<Button
			variant="ghost"
			className="hover:bg-primary/10 flex-col text-shadow-[0px_1px_6px] active:[&_svg]:scale-[.90]"
			onClick={handleClick}
		>
			<Icon
				size={28}
				className={`transition-all will-change-auto ${active ? "text-primary translate-y-0" : "translate-y-3"}`}
			/>
			<span
				className={`transition-all will-change-auto ${active ? "text-primary translate-y-0" : "translate-y-4 opacity-0"}`}
			>
				{title}
			</span>
		</Button>
	)
}
