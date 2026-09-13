"use client"

import { AnimatePresence, m } from "motion/react"
import { type ReactNode, ReactPortal } from "react"
import { createPortal } from "react-dom"

import { ModalBody } from "./components/modal-body"
import { ModalContent } from "./components/modal-content"
import { ModalFooter } from "./components/modal-footer"
import { ModalHeader } from "./components/modal-header"
import { ModalTitle } from "./components/modal-title"
import { useModal } from "./hooks/useModal"

const overlayVariants = {
	hidden: {
		opacity: 0
	},
	visible: {
		opacity: 1
	},
	exit: {
		opacity: 0
	}
}

interface Props {
	open: boolean
	onOpenChange: (open: boolean) => void
	children: ReactNode
}

export const Modal = ({
	open: isOpen,
	onOpenChange,
	children
}: Props): ReactPortal | null => {
	const { handleClose } = useModal(isOpen, onOpenChange)

	if (typeof document === "undefined") {
		return null
	}

	return createPortal(
		<AnimatePresence>
			{isOpen && (
				<div className="fixed inset-0 z-9999" role="dialog" aria-modal="true">
					<m.div
						className="absolute inset-0 bg-black/50 backdrop-blur-sm"
						variants={overlayVariants}
						initial="hidden"
						animate="visible"
						exit="exit"
						transition={{
							duration: 0.2,
							ease: "easeOut"
						}}
						onPointerDown={event => {
							if (event.target === event.currentTarget) handleClose()
						}}
					/>

					<div className="relative flex min-h-full items-center justify-center">
						{children}
					</div>
				</div>
			)}
		</AnimatePresence>,
		document.body
	)
}

Modal.Content = ModalContent
Modal.Header = ModalHeader
Modal.Title = ModalTitle
Modal.Body = ModalBody
Modal.Footer = ModalFooter
