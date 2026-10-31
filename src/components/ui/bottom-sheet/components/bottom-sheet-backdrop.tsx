import { m } from "motion/react"
import type { FC } from "react"

import { cn } from "@/libs/utils"

import type { BottomSheetBackdropProps } from "../types"
import { getBackdropTransition } from "../utils"

interface Props extends BottomSheetBackdropProps {
	reducedMotion: boolean
}

export const BottomSheetBackdrop: FC<Props> = ({
	className,
	onClick,
	reducedMotion
}) => {
	return (
		<m.div
			tabIndex={-1}
			aria-label="Закрыть панель"
			className={cn(
				"pointer-events-auto absolute inset-0 cursor-default select-none",
				"scrim",
				className
			)}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={getBackdropTransition(reducedMotion)}
			onClick={onClick}
			onContextMenu={e => e.preventDefault()}
		/>
	)
}
