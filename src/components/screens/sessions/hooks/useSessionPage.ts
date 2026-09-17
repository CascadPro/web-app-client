import { useState } from "react"

import { Toast } from "@/components/ui"
import { useHaptic } from "@/libs/haptics"
import { useDeleteSessions, useSessions } from "@/libs/query/hooks"
import { errorCatch } from "@/libs/utils"

export const useSessionPage = () => {
	const [isOpen, setIsOpen] = useState<boolean>(false)

	const { data, isLoading } = useSessions()

	const { mutateAsync: deleteAllSessions, isPending: isDeleting } =
		useDeleteSessions()

	const { haptic } = useHaptic()

	const handleDeleteAllSessions = async () => {
		try {
			await deleteAllSessions()
		} catch (error) {
			haptic("medium")

			Toast.show({
				type: "error",
				text1: "Невозможно завершить сеансы",
				text2: errorCatch(error).message
			})
		}
	}

	return {
		isOpen,
		setIsOpen,
		data: data?.data,
		isLoading,
		isDeleting,
		handleDeleteAllSessions
	}
}
