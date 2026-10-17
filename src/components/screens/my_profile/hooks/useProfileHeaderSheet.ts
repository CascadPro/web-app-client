import { useCallback, useRef } from "react"

import {
	toast,
	TOAST_ERROR_DURATION,
	TOAST_SUCCESS_DURATION
} from "@/components/ui/toast"
import { useDeleteAvatar, useUploadAvatar } from "@/libs/query/hooks";
import { errorCatch } from "@/libs/utils";

export const useProfileHeaderSheet = (handleClose: () => void) => {
	const inputRef = useRef<HTMLInputElement>(null)

	const { mutateAsync: deleteAvatar, isPending: isDeleting } = useDeleteAvatar()

	const { mutateAsync: uploadAvatar, isPending: isUploading } =
		useUploadAvatar()

	const handleDeleteAvatar = useCallback(async () => {
		const id = toast.loading("Пожалуйста, подождите...")

		try {
			await deleteAvatar()

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

		try {
			await uploadAvatar({ file, tag: "avatars" })

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
	}, [inputRef.current, uploadAvatar, handleClose])

	const handleUpdateClick = useCallback(() => {
		if (inputRef.current) {
			inputRef.current?.click()
		}
	}, [inputRef.current])

	return {
		inputRef,
		handleUpdateClick,
		handleDeleteAvatar,
		handleUploadAvatar,
		isDeleting,
		isUploading
	}
}
