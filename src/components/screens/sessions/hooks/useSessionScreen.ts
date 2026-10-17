import { useCallback, useState } from "react"

import { toast, TOAST_ERROR_DURATION } from "@/components/ui/toast"
import { useHaptic } from "@/libs/haptics"
import { useDeleteSessions, useSessions } from "@/libs/query/hooks"
import { errorCatch } from "@/libs/utils"

export const useSessionScreen = () => {
	const [isOpen, setIsOpen] = useState(false)

	const { sessions, currentSession, isLoading, isFetching, error } =
		useSessions()

	const { mutateAsync: deleteAllSessions, isPending: isDeleting } =
		useDeleteSessions()

	const { haptic } = useHaptic()

	const handleDeleteAllSessions = useCallback(async () => {
		if (isDeleting) return

		try {
			await deleteAllSessions()
			setIsOpen(false)
		} catch (error) {
			haptic("medium")

			toast.error("Невозможно завершить сеансы", {
				description: errorCatch(error).message,
				duration: TOAST_ERROR_DURATION
			})
		}
	}, [deleteAllSessions, haptic, isDeleting])

	return {
		isOpen,
		setIsOpen,
		sessions,
		currentSession,
		isLoading,
		isFetching,
		isDeleting,
		error: error ? errorCatch(error) : null,
		handleDeleteAllSessions
	}
}
