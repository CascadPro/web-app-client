import { useState } from "react"

import { useClipboardCopy, useScrollLocked } from "@/libs/hooks"

export const useProfileHeader = (
	id: string | undefined,
	avatar?: string | null
) => {
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
	const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false)
	const [isCopied, copyToClipboard] = useClipboardCopy()

	const handleCopy = () => copyToClipboard(id ?? "")

	const handleAvatarClick = () => {
		if (avatar) {
			setIsModalOpen(true)
		} else {
			setIsSheetOpen(true)
		}
	}

	useScrollLocked(isSheetOpen)

	return {
		isModalOpen,
		isSheetOpen,
		isCopied,
		handleCopy,
		handleAvatarClick,
		setIsModalOpen,
		setIsSheetOpen
	}
}
