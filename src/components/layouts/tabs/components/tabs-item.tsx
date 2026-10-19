"use client"

import { type FC, memo } from "react"

import { Button } from "@/components/ui"
import { cn } from "@/libs/utils"

import { type TabsItemIconType, useTabsItem } from "../hooks/useTabsItem"

interface Props {
	title: string
	href: string
	icon: TabsItemIconType
	active: boolean
	isIOS: boolean
	onClick?: () => void
}

const TabsItemComponent: FC<Props> = ({
	title,
	href,
	icon,
	active,
	isIOS,
	onClick
}) => {
	const { Icon, push } = useTabsItem(icon)

	const handleClick = () => {
		push(href)
		onClick?.()
	}

	return (
		<Button
			variant="ghost"
			className={cn("flex-1 flex-col active:scale-90", {
				"hover:bg-primary/10 text-shadow-[0px_1px_6px]": !isIOS,
				"text-on-surface-variant w-28 rounded-4xl px-10 py-1": isIOS,
				"text-primary": active && isIOS
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

export const TabsItem = memo(TabsItemComponent)
TabsItem.displayName = "TabsItem"
