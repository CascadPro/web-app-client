import type { Dispatch, SetStateAction } from "react"
import { useCallback, useState } from "react"

import { toast } from "@/components/ui/toast"
import { useClipboardCopy, useScrollLocked } from "@/libs/hooks"

interface UseProfileHeaderReturn {
	isModalOpen: boolean
	isSheetOpen: boolean
	isCopied: boolean
	handleCopy: () => Promise<void>
	handleAvatarClick: () => void
	handleSheetOpen: () => void
	handleSheetCloseModal: () => void
	setIsModalOpen: Dispatch<SetStateAction<boolean>>
	setIsSheetOpen: Dispatch<SetStateAction<boolean>>
}

export const useProfileHeader = (
	id: string | undefined,
	avatar?: string | null
): UseProfileHeaderReturn => {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [isSheetOpen, setIsSheetOpen] = useState(false)
	const [isCopied, copyToClipboard] = useClipboardCopy()

	const handleCopy = useCallback(async () => {
		if (!id) return

		await copyToClipboard(id)

		toast.info("Текст скопирован!", {
			miniature: true,
			duration: 2000
		})
	}, [id, copyToClipboard])

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
		isModalOpen,
		isSheetOpen,
		isCopied,
		handleCopy,
		handleAvatarClick,
		handleSheetOpen,
		handleSheetCloseModal,
		setIsModalOpen,
		setIsSheetOpen
	}
}
