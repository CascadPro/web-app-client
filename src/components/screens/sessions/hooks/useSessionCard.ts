import { type MouseEvent, useMemo, useState } from "react"

import type { SessionsHttpDtoSessionDtoMetadata } from "@/api/generated"
import { toast, TOAST_ERROR_DURATION } from "@/components/ui/toast"
import { useHaptic } from "@/libs/haptics"
import { useDeleteSession } from "@/libs/query/hooks"
import { errorCatch } from "@/libs/utils"
import { parseDevice } from "@/libs/utils/screens/sessions"

export const useSessionCard = (
	id?: string,
	metadata?: SessionsHttpDtoSessionDtoMetadata
) => {
	const location = metadata?.location

	const device = useMemo(
		() => parseDevice(metadata?.device),
		[metadata?.device]
	)

	const [isOpen, setIsOpen] = useState<boolean>(false)

	const { haptic } = useHaptic()

	const { mutateAsync, isPending } = useDeleteSession(id || "")

	const handleDelete = async (e: MouseEvent<HTMLButtonElement>) => {
		if (!id) return
		e.stopPropagation()

		try {
			await mutateAsync()
		} catch (error) {
			haptic("medium")

			toast.error("Не удалось удалить сессию", {
				description: errorCatch(error).message,
				duration: TOAST_ERROR_DURATION
			})
		} finally {
			setIsOpen(false)
		}
	}

	return {
		DeviceIcon: device.os.icon,
		device,
		location,
		isOpen,
		setIsOpen,
		handleDelete,
		isDeleting: isPending
	}
}
