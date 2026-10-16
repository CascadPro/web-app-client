"use client"

import { m, PanInfo } from "motion/react"
import { type FC } from "react"

import { cn } from "@/libs/utils"

import { Title } from "../../title"
import { useBottomSheetPanel } from "../hooks/useBottomSheetPanel"
import type { BottomSheetPanelProps } from "../types"
import { getSheetTransition } from "../utils"

import { BottomSheetHandle } from "./bottom-sheet-handle"

export const BottomSheetPanel: FC<BottomSheetPanelProps> = ({
	open,
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
	panelRef,
	expanded,
	expandable,
	expandedHeight,
	onExpandedChange
}) => {
	const {
		contentRef,
		dragControls,
		dragStartHeight,
		rubberScaleValue,
		rubberScale,
		dragHeight,
		setDragHeight,
		handleDragEndWithHeight,
		handlePointerDown
	} = useBottomSheetPanel(
		dismissThreshold,
		dragToClose,
		dragAnywhere,
		expanded,
		expandable,
		onClose,
		onExpandedChange
	)

	const handleDragStart = () => {
		const panel = panelRef.current
		if (!panel) return

		dragStartHeight.current = panel.getBoundingClientRect().height
		setDragHeight(dragStartHeight.current)
	}

	const handleDrag = (
		_: MouseEvent | TouchEvent | PointerEvent,
		info: PanInfo
	) => {
		if (reducedMotion) return

		if (expandable) {
			const viewportHeight = window.innerHeight
			const maxHeight =
				typeof expandedHeight === "number"
					? expandedHeight
					: expandedHeight.endsWith("dvh")
						? (parseFloat(expandedHeight) / 100) * viewportHeight
						: expandedHeight.endsWith("vh")
							? (parseFloat(expandedHeight) / 100) * viewportHeight
							: viewportHeight * 0.9

			const minHeight = dragStartHeight.current

			// Свайп вверх увеличивает высоту, низ панели остаётся на месте.
			const nextHeight = Math.max(
				minHeight,
				Math.min(maxHeight, dragStartHeight.current - info.offset.y)
			)

			setDragHeight(nextHeight)
		} else {
			const pull = Math.max(0, -info.offset.y)
			const stretch = Math.min(pull / 120, 1) * 0.05

			rubberScaleValue.set(1 + stretch)
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
				"fixed inset-x-0 isolate overflow-hidden",
				"flex max-h-[calc(100dvh-env(safe-area-inset-top)-1rem)] flex-col",
				"not-motion-reduce:glass not-motion-reduce:glass-highlight motion-reduce:bg-background",
				"text-on-background rounded-t-3xl outline-none",
				panelCN
			)}
			style={{
				bottom: 0,
				paddingBottom: "env(safe-area-inset-bottom)",
				pointerEvents: open ? "auto" : "none",
				transformOrigin: "center bottom",
				scaleY: rubberScale
			}}
			initial={{ y: "100%" }}
			animate={{
				y: open ? 0 : "100%",
				height: dragHeight ?? (expanded ? expandedHeight : "auto")
			}}
			exit={{ y: "100%" }}
			transition={getSheetTransition(reducedMotion)}
			drag={open && dragToClose ? "y" : false}
			dragControls={dragControls}
			dragListener={false}
			dragMomentum={false}
			dragSnapToOrigin
			dragConstraints={{
				top: 0,
				bottom: dragToClose ? dismissThreshold + 80 : 0
			}}
			dragElastic={reducedMotion ? 0 : { top: 0, bottom: 0.25 }}
			onDragStart={handleDragStart}
			onDrag={handleDrag}
			onDragEnd={handleDragEndWithHeight}
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
					"px-4 py-5 [-webkit-overflow-scrolling:touch]",
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
