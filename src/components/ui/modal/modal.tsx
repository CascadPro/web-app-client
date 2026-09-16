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
	overlayInteractive?: boolean
}

export const Modal = ({
	open: isOpen,
	onOpenChange,
	children,
	overlayInteractive = true
}: Props): ReactPortal | null => {
	const { handleClose } = useModal(isOpen, onOpenChange)

	if (typeof document === "undefined") {
		return null
	}

	return createPortal(
		<AnimatePresence>
			{isOpen && (
				<div className="fixed inset-0 z-8888" role="dialog" aria-modal="true">
					<m.div
						className="pointer-events-auto absolute inset-0 bg-black/50 backdrop-blur-xs"
						variants={overlayVariants}
						initial="hidden"
						animate="visible"
						exit="exit"
						transition={{
							duration: 0.2,
							ease: "easeOut"
						}}
						onPointerDown={
							overlayInteractive
								? event => {
							if (event.target === event.currentTarget) handleClose()
									}
								: undefined
						}
					/>

					<div className="pointer-events-none absolute top-1/2 left-1/2 flex w-full -translate-1/2 flex-col items-center *:pointer-events-auto!">
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
