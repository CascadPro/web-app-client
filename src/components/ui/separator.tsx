import type { FC, HTMLAttributes } from "react"

import { cn } from "@/libs/utils"

interface Props extends HTMLAttributes<HTMLDivElement> {
	type: "vertical" | "horizontal"
}

export const Separator: FC<Props> = ({
	type = "horizontal",
	className,
	...props
}) => {
	return (
		<div
			className={cn(
				"bg-outline",
				type === "horizontal" ? "h-px w-full" : "h-full w-px",
				className
			)}
		></div>
	)
}
