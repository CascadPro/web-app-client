"use client"

import { m, type PanInfo, useDragControls } from "motion/react"
import type { FC } from "react"

import { cn } from "@/libs/utils"

import { Title } from "../../title"
import type { BottomSheetPanelProps } from "../types"
import { getSheetTransition } from "../utils"

import { BottomSheetHandle } from "./bottom-sheet-handle"

export const BottomSheetPanel: FC<BottomSheetPanelProps> = ({
	open,
	offset,
	title,
	titleId,
	titleCN,
	className,
	panelCN,
	indicator,
	indicatorCN,
	dragToClose,
	dismissThreshold,
	reducedMotion,
	onClose,
	children,
	panelRef
}) => {
	const dragControls = useDragControls()

	const handleDragEnd = (
		_: MouseEvent | TouchEvent | PointerEvent,
		info: PanInfo
	) => {
		if (!dragToClose) return

		if (
			info.offset.y > dismissThreshold ||
			(info.offset.y > 30 && info.velocity.y > 700)
		) {
			onClose()
		}
	}

	return (
		<m.div
			ref={panelRef}
			role="dialog"
			aria-modal={open ? true : undefined}
			aria-labelledby={title ? titleId : undefined}
			aria-label={!title ? "Bottom sheet" : undefined}
			aria-hidden={!open}
			tabIndex={-1}
			className={cn(
				"pointer-events-auto fixed inset-x-0",
				"flex max-h-[calc(100dvh-env(safe-area-inset-top)-1rem)]",
				"flex-col overflow-hidden rounded-t-3xl",
				"bg-background text-on-background",
				"shadow-[0_-8px_40px_rgba(0,0,0,0.12)] outline-none",
				panelCN
			)}
			style={{
				bottom: offset,
				paddingBottom: "env(safe-area-inset-bottom)",
				pointerEvents: open ? "auto" : "none"
			}}
			initial={{ y: "100%" }}
			animate={{ y: open ? 0 : "100%" }}
			exit={{ y: "100%" }}
			transition={getSheetTransition(reducedMotion)}
			drag={open && dragToClose ? "y" : false}
			dragControls={dragControls}
			dragListener={false}
			dragMomentum={false}
			dragElastic={reducedMotion ? 0 : { top: 0, bottom: 0.7 }}
			onDragEnd={handleDragEnd}
		>
			<BottomSheetHandle
				visible={indicator}
				className={indicatorCN}
				dragControls={dragControls}
				onClose={onClose}
			/>

			<div
				className={cn(
					"min-h-0 overflow-y-auto overscroll-contain",
					"pwa:mb-10 px-4 py-5 [-webkit-overflow-scrolling:touch]",
					indicator && "mt-3",
					className
				)}
			>
				{title && (
					<Title id={titleId} size="md" className={cn("mb-3", titleCN)}>
						{title}
					</Title>
				)}

				{children}
			</div>
		</m.div>
	)
}
