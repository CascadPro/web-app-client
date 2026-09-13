import { useQueryClient } from "@tanstack/react-query"
import { type MouseEvent, useMemo, useState } from "react"

import type { SessionsHttpDtoSessionDtoMetadata } from "@/api/generated"
import { Toast } from "@/components/ui"
import { useDeleteSession } from "@/libs/query/hooks"
import { QueryKeys } from "@/libs/query/keys"
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

	const client = useQueryClient()

	const { mutateAsync, isPending } = useDeleteSession(id || "")

	const handleDelete = async (e: MouseEvent<HTMLButtonElement>) => {
		if (!id) return
		e.stopPropagation()

		try {
			await mutateAsync()

			client.invalidateQueries({ queryKey: QueryKeys.sessions.all })
		} catch (error) {
			const message = errorCatch(error).message

			Toast.show({
				type: "error",
				text1: "Не удалось удалить сессию",
				text2: message
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
