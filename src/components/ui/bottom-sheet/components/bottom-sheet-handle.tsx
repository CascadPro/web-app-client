import type { FC, KeyboardEvent, PointerEvent } from "react"

import { cn } from "@/libs/utils"

import type { BottomSheetHandleProps } from "../types"

export const BottomSheetHandle: FC<BottomSheetHandleProps> = ({
	visible,
	className,
	dragControls,
	onClose
}) => {
	if (!visible) return null

	const handlePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
		dragControls.start(event)
	}

	const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault()
			onClose()
		}
	}

	return (
		<button
			tabIndex={0}
			aria-label="Перетащить панель или нажать для закрытия"
			className={cn(
				"absolute top-0 left-0 z-10",
				"flex h-10 w-full touch-none items-center justify-center",
				"cursor-grab active:cursor-grabbing",
				className
			)}
			onPointerDown={handlePointerDown}
			onKeyDown={handleKeyDown}
		>
			<span className="bg-on-surface-variant/50 h-1.5 w-12 rounded-full" />
		</button>
	)
}
