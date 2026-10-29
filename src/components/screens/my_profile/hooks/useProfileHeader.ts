import { useReducedMotion } from "motion/react"
import type { Dispatch, SetStateAction } from "react"
import { useCallback, useState } from "react"

import { useClipboardCopy, useScrollLocked } from "@/libs/hooks"

interface UseProfileHeaderReturn {
	reduceMotion: boolean | null
	isModalOpen: boolean
	isSheetOpen: boolean
	isCopied: boolean
	handleCopy: (text: string) => Promise<void>
	handleAvatarClick: () => void
	handleSheetOpen: () => void
	handleSheetCloseModal: () => void
	setIsModalOpen: Dispatch<SetStateAction<boolean>>
	setIsSheetOpen: Dispatch<SetStateAction<boolean>>
}

export const useProfileHeader = (
	avatar?: string | null
): UseProfileHeaderReturn => {
	const reduceMotion = useReducedMotion()

	const [isModalOpen, setIsModalOpen] = useState(false)
	const [isSheetOpen, setIsSheetOpen] = useState(false)
	const [isCopied, copyToClipboard] = useClipboardCopy()

	const handleAvatarClick = useCallback(() => {
		if (avatar) {
			setIsModalOpen(true)
		} else {
			setIsSheetOpen(true)
		}
	}, [avatar])

	const handleSheetOpen = useCallback(() => {
		setIsSheetOpen(true)
	}, [])

	const handleSheetCloseModal = useCallback(() => {
		setIsModalOpen(false)
	}, [])

	useScrollLocked(isSheetOpen)

	return {
		reduceMotion,
		isModalOpen,
		isSheetOpen,
		isCopied,
		handleCopy: copyToClipboard,
		handleAvatarClick,
		handleSheetOpen,
		handleSheetCloseModal,
		setIsModalOpen,
		setIsSheetOpen
	}
}
