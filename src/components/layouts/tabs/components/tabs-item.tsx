"use client"

import type { FC } from "react";

import { Button } from "@/components/ui";
import { cn } from "@/libs/utils";

import { type TabsItemIconType, useTabsItem } from "../hooks/useTabsItem";

interface Props {
	title: string
	href: string
	icon: TabsItemIconType
	isIOS: boolean
}

export const TabsItem: FC<Props> = ({ title, href, icon, isIOS }) => {
	const { Icon, active, handleClick } = useTabsItem(href, icon)

	return (
		<Button
			variant="ghost"
			className={cn("flex-col active:scale-90", {
				"hover:bg-primary/10 text-shadow-[0px_1px_6px]":
					!isIOS,
				"text-on-surface-variant rounded-4xl px-10 py-1": isIOS,
				"bg-primary/10 text-primary": active && isIOS
			})}
			onClick={handleClick}
		>
			<Icon
				size={26}
				className={cn({
					"translate-y-3 transition-all will-change-auto motion-reduce:transition-none":
						!isIOS,
					"text-primary translate-y-0": active && !isIOS
				})}
			/>

			<span
				className={cn({
					"translate-y-4 opacity-0 transition-all will-change-auto": !isIOS,
					"text-primary translate-y-0 opacity-100": active && !isIOS
				})}
			>
				{title}
			</span>
		</Button>
	)
}
