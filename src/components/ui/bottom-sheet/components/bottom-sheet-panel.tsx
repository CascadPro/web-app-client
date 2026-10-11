"use client"

import { m } from "motion/react"
import type { FC } from "react"

import { cn } from "@/libs/utils"

import { Title } from "../../title"
import { useBottomSheetPanel } from "../hooks/useBottomSheetPanel"
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
	dragAnywhere,
	dismissThreshold,
	reducedMotion,
	onClose,
	children,
	panelRef
}) => {
	const { contentRef, dragControls, handleDragEnd, handlePointerDown } =
		useBottomSheetPanel(dismissThreshold, dragToClose, dragAnywhere, onClose)

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
			dragSnapToOrigin
			dragConstraints={{
				top: 0,
				bottom: Math.max(dismissThreshold + 80, 240)
			}}
			dragElastic={reducedMotion ? 0 : { top: 0, bottom: 0.25 }}
			onDragEnd={handleDragEnd}
			onPointerDown={dragAnywhere ? handlePointerDown : undefined}
		>
			<BottomSheetHandle
				visible={indicator}
				className={indicatorCN}
				dragControls={dragControls}
				onClose={onClose}
			/>

			<div
				ref={contentRef}
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
