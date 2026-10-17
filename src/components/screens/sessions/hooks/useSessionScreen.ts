import { useState } from "react"

import { toast, TOAST_ERROR_DURATION } from "@/components/ui/toast"
import { useHaptic } from "@/libs/haptics"
import { useDeleteSessions, useSessions } from "@/libs/query/hooks"
import { errorCatch } from "@/libs/utils"

export const useSessionScreen = () => {
	const [isOpen, setIsOpen] = useState<boolean>(false)

	const { sessions, currentSession, isLoading, isPending, error } =
		useSessions()

	const { mutateAsync: deleteAllSessions, isPending: isDeleting } =
		useDeleteSessions()

	const { haptic } = useHaptic()

	const handleDeleteAllSessions = async () => {
		try {
			await deleteAllSessions()
		} catch (error) {
			haptic("medium")

			toast.error("Невозможно завершить сеансы", {
				description: errorCatch(error).message,
				duration: TOAST_ERROR_DURATION
			})
		}
	}

	return {
		isOpen,
		setIsOpen,
		sessions,
		currentSession,
		isLoading: isLoading || isPending,
		isDeleting,
		error: error ? errorCatch(error) : null,
		handleDeleteAllSessions
	}
}
