import type { FC, PropsWithChildren } from "react"

import { cn } from "@/libs/utils"

interface Props {
	className?: string
}

export const Container: FC<PropsWithChildren<Props>> = ({
	children,
	className
}) => {
	return (
		<div className={cn("mx-auto max-w-screen-2xl", className)} aria-hidden>
			{children}
		</div>
	)
}
