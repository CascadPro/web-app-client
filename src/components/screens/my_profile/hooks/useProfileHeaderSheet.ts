import type { RefObject } from "react"
import { useCallback, useRef } from "react"

import {
	toast,
	TOAST_ERROR_DURATION,
	TOAST_SUCCESS_DURATION
} from "@/components/ui/toast"
import { useDeleteAvatar, useUploadAvatar } from "@/libs/query/hooks"
import { createIdempotencyKey } from "@/libs/query/idempotency"
import { errorCatch } from "@/libs/utils"

interface UseProfileHeaderSheetReturn {
	inputRef: RefObject<HTMLInputElement | null>
	handleUpdateClick: () => void
	handleDeleteAvatar: () => Promise<void>
	handleUploadAvatar: () => Promise<void>
	isDeleting: boolean
	isUploading: boolean
}

export const useProfileHeaderSheet = (
	handleClose: () => void
): UseProfileHeaderSheetReturn => {
	const inputRef = useRef<HTMLInputElement>(null)

	const { mutateAsync: deleteAvatar, isPending: isDeleting } = useDeleteAvatar()

	const { mutateAsync: uploadAvatar, isPending: isUploading } =
		useUploadAvatar()

	const handleDeleteAvatar = useCallback(async () => {
		const id = toast.loading("Пожалуйста, подождите...", { dismissible: false })
		const idempotencyKey = createIdempotencyKey()

		try {
			await deleteAvatar({ idempotencyKey })

			handleClose()

			toast.update(id, {
				type: "success",
				title: "Аватар успешно удален",
				duration: TOAST_SUCCESS_DURATION
			})
		} catch (error) {
			toast.update(id, {
				type: "error",
				title: "Не удалось удалить аватар",
				description: errorCatch(error).message,
				duration: TOAST_ERROR_DURATION
			})
		}
	}, [deleteAvatar, handleClose])

	const handleUploadAvatar = useCallback(async () => {
		const file = inputRef.current?.files?.[0]

		if (!file) return

		const id = toast.loading("Пожалуйста, подождите...")
		const idempotencyKey = createIdempotencyKey()

		try {
			await uploadAvatar({
				body: { file, tag: "avatars" },
				idempotencyKey
			})

			handleClose()

			toast.update(id, {
				type: "success",
				title: "Аватар успешно загружен"
			})
		} catch (error) {
			toast.update(id, {
				type: "error",
				title: "Не удалось загрузить аватар",
				description: errorCatch(error).message
			})
		}
	}, [uploadAvatar, handleClose])

	const handleUpdateClick = useCallback(() => {
		inputRef.current?.click()
	}, [])

	return {
		inputRef,
		handleUpdateClick,
		handleDeleteAvatar,
		handleUploadAvatar,
		isDeleting,
		isUploading
	}
}
