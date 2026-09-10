import { ChevronRightIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import type { FC } from "react"

import { Button } from "@/components/ui"

import type { MenuPageItemData } from "../hooks/useMenuPage"

interface Props {
	item: MenuPageItemData
}

export const MenuItem: FC<Props> = ({ item }) => {
	const { push } = useRouter()

	const handleClick = () => push(item.href)

	return (
		<Button
			variant="ghost"
			className="bg-surface active:bg-tertiary/50 hover:shadow-tertiary justify-between rounded-lg p-3 hover:-translate-y-1 hover:shadow-md active:translate-x-1"
			onClick={handleClick}
		>
			<div className="flex items-center gap-2">
				<item.icon size={24} className="text-on-surface" />
				<span>{item.title}</span>
			</div>

			<div className="bg-primary rounded-md p-1">
				<ChevronRightIcon size={24} className="text-on-primary" />
			</div>
		</Button>
	)
}
