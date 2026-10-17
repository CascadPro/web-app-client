"use client"

import { AnimatePresence, domMax, LazyMotion } from "motion/react"
import { memo } from "react"
import { createPortal } from "react-dom"

import { BottomSheetBackdrop } from "./components/bottom-sheet-backdrop"
import { BottomSheetPanel } from "./components/bottom-sheet-panel"
import { useBottomSheet } from "./hooks/useBottomSheet"
import { useBottomSheetExpand } from "./hooks/useBottomSheetExpande"
import type { BottomSheetProps } from "./types"

const BottomSheetComponent = memo(function BottomSheetComponent({
	children,
	open,
	onChange,
	className,
	zIndex = 100,
	indicator = true,
	indicatorCN,
	title,
	titleCN,
	closeOnBackdropClick = true,
	closeOnEscape = true,
	dragToClose = true,
	dragAnywhere = true,
	dismissThreshold = 120,
	showBackdrop = true,
	keepMounted = false,
	panelCN,
	backdropCN,
	expandable = false,
	expanded,
	defaultExpanded = false,
	onExpandedChange,
	expandedHeight = "90dvh"
}: Readonly<BottomSheetProps>) {
	const {
		panelRef,
		titleId,
		reducedMotion,
		mounted,
		hasOpened,
		close,
		handleBackdropClick
	} = useBottomSheet(open, onChange, closeOnBackdropClick, closeOnEscape)

	const { isExpanded, setIsExpanded } = useBottomSheetExpand(
		open,
		expanded,
		defaultExpanded,
		expandable,
		onExpandedChange
	)

	if (!mounted) return null

	const shouldRenderPanel = open || (keepMounted && hasOpened)

	return createPortal(
		<LazyMotion features={domMax}>
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
							title={title}
							titleId={titleId}
							titleCN={titleCN}
							className={className}
							panelCN={panelCN}
							indicator={indicator}
							indicatorCN={indicatorCN}
							dragToClose={dragToClose}
							dragAnywhere={dragAnywhere}
							dismissThreshold={dismissThreshold}
							reducedMotion={reducedMotion}
							onClose={close}
							panelRef={panelRef}
							expanded={isExpanded}
							expandable={expandable}
							expandedHeight={expandedHeight}
							onExpandedChange={setIsExpanded}
						>
							{children}
						</BottomSheetPanel>
					)}
				</AnimatePresence>
			</div>
		</LazyMotion>,
		document.body
	)
})

BottomSheetComponent.displayName = "BottomSheet"

export { BottomSheetComponent as BottomSheet }
export type { BottomSheetProps }
