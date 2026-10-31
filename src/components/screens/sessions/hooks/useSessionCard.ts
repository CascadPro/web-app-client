import type { MouseEvent } from "react"
import { useCallback, useMemo, useState } from "react"

import type {
	SessionsHttpDtoSessionDtoMetadata,
	SessionsHttpDtoSessionDtoMetadataLocation
} from "@/api/generated"
import { toast, TOAST_ERROR_DURATION } from "@/components/ui/toast"
import { useHaptic } from "@/libs/haptics"
import { useDeleteSession } from "@/libs/query/hooks"
import { errorCatch } from "@/libs/utils"
import { parseDevice } from "@/libs/utils/screens/sessions"

interface UseSessionCardReturn {
	device: ReturnType<typeof parseDevice>
	location: SessionsHttpDtoSessionDtoMetadataLocation | undefined
	isOpen: boolean
	setIsOpen: (state: boolean) => void
	handleDelete: (event: MouseEvent<HTMLButtonElement>) => Promise<void>
	isDeleting: boolean
}

export const useSessionCard = (
	id?: string,
	metadata?: SessionsHttpDtoSessionDtoMetadata
): UseSessionCardReturn => {
	const location = metadata?.location

	const device = useMemo(
		() => parseDevice(metadata?.device),
		[metadata?.device]
	)

	const [isOpen, setIsOpen] = useState<boolean>(false)

	const { haptic } = useHaptic()
	const { mutateAsync, isPending } = useDeleteSession(id ?? "")

	const safeMutateAsync = useCallback(async () => {
		if (!id) return
		await mutateAsync()
	}, [id, mutateAsync])

	const handleDelete = useCallback(
		async (event: MouseEvent<HTMLButtonElement>) => {
			event.stopPropagation()

			if (!id || isPending) return

			try {
				await safeMutateAsync()
				setIsOpen(false)
			} catch (error) {
				haptic("medium")

				toast.error("Не удалось удалить сессию", {
					description: errorCatch(error).message,
					duration: TOAST_ERROR_DURATION
				})
			}
		},
		[id, isPending, safeMutateAsync, haptic]
	)

	const handleOpenChange = useCallback(
		(state: boolean) => {
			if (isPending) return
			setIsOpen(state)
		},
		[isPending]
	)

	return {
		device,
		location,
		isOpen,
		setIsOpen: handleOpenChange,
		handleDelete,
		isDeleting: isPending
	}
}
