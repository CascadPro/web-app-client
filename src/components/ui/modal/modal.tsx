"use client"

import { AnimatePresence } from "motion/react"
import { memo, type ReactNode, type ReactPortal, useCallback } from "react"
import { createPortal } from "react-dom"

import { ModalBackdrop } from "./components/modal-backdrop"
import { ModalBody } from "./components/modal-body"
import { ModalContent } from "./components/modal-content"
import { ModalFooter } from "./components/modal-footer"
import { ModalHeader } from "./components/modal-header"
import { ModalTitle } from "./components/modal-title"
import { useModal } from "./hooks/useModal"

interface ModalProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	children: ReactNode
	overlayInteractive?: boolean
	closeOnEscape?: boolean
	ariaLabel?: string
}

const ModalComponent = memo(function ModalComponent({
	open,
	onOpenChange,
	children,
	overlayInteractive = true,
	closeOnEscape = true,
	ariaLabel = "Диалоговое окно"
}: Readonly<ModalProps>): ReactPortal | null {
	const { reducedMotion, handleClose } = useModal(
		open,
		onOpenChange,
		closeOnEscape
	)

	const handleOverlayPointerDown = useCallback(
		(event: React.PointerEvent<HTMLDivElement>) => {
			if (overlayInteractive && event.target === event.currentTarget) {
				handleClose()
			}
		},
		[handleClose, overlayInteractive]
	)

	if (typeof document === "undefined") return null

	return createPortal(
		<AnimatePresence initial={false}>
			{open && (
				<div
					className="fixed inset-0 z-8888"
					role="dialog"
					aria-modal="true"
					aria-label={ariaLabel}
					aria-describedby={undefined}
				>
					<ModalBackdrop
						reducedMotion={reducedMotion}
						onClick={handleOverlayPointerDown}
					/>

					<div className="pointer-events-none absolute top-1/2 left-1/2 flex w-full -translate-1/2 flex-col items-center *:pointer-events-auto!">
						{children}
					</div>
				</div>
			)}
		</AnimatePresence>,
		document.body
	)
})

export const Modal = Object.assign(ModalComponent, {
	Content: ModalContent,
	Header: ModalHeader,
	Title: ModalTitle,
	Body: ModalBody,
	Footer: ModalFooter
})
