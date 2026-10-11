import type { FC } from "react"

import { cn } from "@/libs/utils"

import type { RequestCardDescriptionData } from "../../libs"

interface Props extends Omit<RequestCardDescriptionData, "itemKey"> {
	className?: string
}

export const RequestCardDescription: FC<Props> = ({ className, ...props }) => {
	return (
		<div
			className={cn(
				"text-on-surface-variant flex items-center gap-1.5 text-sm",
				className
			)}
		>
			<props.icon size={18} className="shrink-0" />

			<span>{props.text}&nbsp;</span>
		</div>
	)
}
