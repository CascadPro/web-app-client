import { useState } from "react"

import { toast } from "@/components/ui/toast"
import { useClipboardCopy, useScrollLocked } from "@/libs/hooks"

export const useProfileHeader = (
	id: string | undefined,
	avatar?: string | null
) => {
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
	const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false)
	const [isCopied, copyToClipboard] = useClipboardCopy()

	const handleCopy = async () => {
		await copyToClipboard(id ?? "")

		toast.info("Текст скопирован!", { miniature: true, duration: 2000 })
	}

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
