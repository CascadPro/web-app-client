"use client"

import type { FC, PropsWithChildren } from "react"
import BottomSheet from "react-swipeable-bottom-sheet"

import { useScrollLocked } from "@/libs/hooks"
import { cn } from "@/libs/utils"

interface Props extends PropsWithChildren {
	open: boolean
	onChange: (isOpen: boolean) => void

	zIndex?: number
	offset?: number
	className?: string

	indicator?: boolean
	indicatorCN?: string
}

const BottomSheetComponent: FC<Props> = ({
	children,
	open,
	onChange,
	className,
	offset = -12,
	zIndex = 100,
	indicator = true,
	indicatorCN
}) => {
	useScrollLocked(open)

	return (
		<BottomSheet
			open={open}
			onChange={onChange}
			style={{ zIndex, bottom: offset }}
			bodyStyle={{ backgroundColor: "var(--background)" }}
			defaultOpen={false}
		>
			<div className={cn("text-on-background mt-4", className)}>
				{indicator && (
					<div
						className={cn(
							"bg-on-surface-variant/50 absolute top-3 left-1/2 h-2 w-24 -translate-1/2 rounded-2xl",
							indicatorCN
						)}
					/>
				)}

				{children}
			</div>
		</BottomSheet>
	)
}

export { BottomSheetComponent as BottomSheet }
