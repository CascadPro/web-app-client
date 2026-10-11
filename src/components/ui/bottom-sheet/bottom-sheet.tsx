"use client"

import { AnimatePresence } from "motion/react"
import { memo } from "react"
import { createPortal } from "react-dom"

import { BottomSheetBackdrop } from "./components/bottom-sheet-backdrop"
import { BottomSheetPanel } from "./components/bottom-sheet-panel"
import { useBottomSheet } from "./hooks/useBottomSheet"
import type { BottomSheetProps } from "./types"

const BottomSheetComponent = memo(function BottomSheetComponent({
	children,
	open,
	onChange,
	className,
	offset = -12,
	zIndex = 100,
	indicator = true,
	indicatorCN,
	title,
	titleCN,
	closeOnBackdropClick = true,
	closeOnEscape = true,
	dragToClose = true,
	dismissThreshold = 120,
	showBackdrop = true,
	keepMounted = false,
	panelCN,
	backdropCN
}: Readonly<BottomSheetProps>) {
	const {
		panelRef,
		titleId,
		reducedMotion,
		mounted,
		hasOpened,
		handleBackdropClick
	} = useBottomSheet(open, onChange, closeOnBackdropClick, closeOnEscape)

	if (!mounted) return null

	const shouldRenderPanel = open || (keepMounted && hasOpened)

	return createPortal(
		<div
			className="pointer-events-none fixed inset-0"
			style={{ zIndex }}
			aria-hidden={!open}
			inert={!open}
		>
			<AnimatePresence initial={false}>
				{open && showBackdrop && (
					<BottomSheetBackdrop
						key="backdrop"
						className={backdropCN}
						onClick={handleBackdropClick}
						reducedMotion={reducedMotion}
					/>
				)}
			</AnimatePresence>

			<AnimatePresence initial={false}>
				{shouldRenderPanel && (
					<BottomSheetPanel
						key="panel"
						open={open}
						offset={offset}
						title={title}
						titleId={titleId}
						titleCN={titleCN}
						className={className}
						panelCN={panelCN}
						indicator={indicator}
						indicatorCN={indicatorCN}
						dragToClose={dragToClose}
						dismissThreshold={dismissThreshold}
						reducedMotion={reducedMotion}
						onClose={close}
						panelRef={panelRef}
					>
						{children}
					</BottomSheetPanel>
				)}
			</AnimatePresence>
		</div>,
		document.body
	)
})

BottomSheetComponent.displayName = "BottomSheet"

export { BottomSheetComponent as BottomSheet }
export type { BottomSheetProps }
