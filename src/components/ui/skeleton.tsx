import { type HTMLMotionProps, m } from "motion/react"
import type { FC, HTMLAttributes } from "react"

import { cn } from "@/libs/utils"

const Skeleton: FC<HTMLAttributes<HTMLDivElement>> = ({
	className,
	...props
}) => {
	return (
		<div
			className={cn("bg-on-background/20 animate-pulse rounded-md", className)}
			{...props}
		/>
	)
}

const MotionSkeleton: FC<HTMLMotionProps<"div">> = ({
	className,
	...props
}) => {
	return (
		<m.div
			className={cn("bg-muted/40 animate-pulse rounded-md", className)}
			{...props}
		/>
	)
}

export { MotionSkeleton, Skeleton }
