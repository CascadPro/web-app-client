import { ChevronRightIcon } from "lucide-react"
import { type FC, memo } from "react"

import { Button } from "@/components/ui"
import { useNavigation } from "@/libs/hooks"

import { MenuPageItemData } from "../data"

interface Props {
	item: MenuPageItemData
}

const MenuItemComponent: FC<Props> = ({ item }) => {
	const { push } = useNavigation()

	const handleClick = () => push(item.href)

	return (
		<Button
			variant="ghost"
			className="group border-outline/20 bg-surface active:bg-secondary/50 hover:shadow-secondary w-full justify-between rounded-lg border p-3 hover:-translate-y-1 hover:shadow-md active:translate-x-1"
			onClick={handleClick}
		>
			<div className="flex items-center gap-2">
				<item.icon size={24} className="text-on-surface" />
				<span>{item.title}</span>
			</div>

			<div className="bg-primary/10 glass-lite glass-highlight rounded-lg p-1">
				<ChevronRightIcon
					aria-hidden="true"
					size={24}
					className="text-primary transition-transform will-change-auto group-hover:translate-x-0.5 motion-reduce:transition-none"
				/>
			</div>
		</Button>
	)
}

export const MenuItem = memo(MenuItemComponent)
MenuItem.displayName = "MenuItem"
