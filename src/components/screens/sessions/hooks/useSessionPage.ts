import { useState } from "react"

import { Toast } from "@/components/ui"
import { useDeleteSessions, useSessions } from "@/libs/query/hooks"
import { errorCatch } from "@/libs/utils"

export const useSessionPage = () => {
	const [isOpen, setIsOpen] = useState<boolean>(false)

	const { data, isLoading, refetch } = useSessions()

	const { mutateAsync: deleteAllSessions, isPending: isDeleting } =
		useDeleteSessions()

	const handleDeleteAllSessions = async () => {
		try {
			await deleteAllSessions()
			await refetch()
		} catch (error) {
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
