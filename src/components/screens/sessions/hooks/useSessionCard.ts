import { type MouseEvent, useMemo, useState } from "react"

import type { SessionsHttpDtoSessionDtoMetadata } from "@/api/generated"
import { Toast } from "@/components/ui"
import { useHaptic } from "@/libs/haptics"
import { useDeleteSession } from "@/libs/query/hooks"
import { errorCatch, parseDevice } from "@/libs/utils"

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

			Toast.show({
				type: "error",
				text1: "Не удалось удалить сессию",
				text2: errorCatch(error).message
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
