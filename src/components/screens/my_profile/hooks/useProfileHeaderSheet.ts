import { useCallback, useRef } from "react"

import { Toast } from "@/components/ui"
import { useDeleteAvatar, useUploadAvatar } from "@/libs/query/hooks"
import { errorCatch } from "@/libs/utils"

export const useProfileHeaderSheet = (handleClose: () => void) => {
	const inputRef = useRef<HTMLInputElement>(null)

	const { mutateAsync: deleteAvatar, isPending: isDeleting } = useDeleteAvatar()

	const { mutateAsync: uploadAvatar, isPending: isUploading } =
		useUploadAvatar()

	const handleDeleteAvatar = useCallback(async () => {
		try {
			await deleteAvatar()

			handleClose()

			Toast.show({
				type: "success",
				text1: "Аватар успешно удален"
			})
		} catch (error) {
			Toast.show({
				type: "error",
				text1: "Не удалось удалить аватар",
				text2: errorCatch(error).message
			})
		}
	}, [deleteAvatar, handleClose])

	const handleUploadAvatar = useCallback(async () => {
		const file = inputRef.current?.files?.[0]

		if (!file) return

		try {
			await uploadAvatar({ file, tag: "avatars" })

			handleClose()

			Toast.show({
				type: "success",
				text1: "Аватар успешно загружен"
			})
		} catch (error) {
			Toast.show({
				type: "error",
				text1: "Не удалось загрузить аватар",
				text2: errorCatch(error).message
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
