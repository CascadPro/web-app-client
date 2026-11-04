"use client"

import { useCallback, useState } from "react"

import {
	toast,
	TOAST_ERROR_DURATION,
	TOAST_SUCCESS_DURATION
} from "@/components/ui/toast"
import type { RequestDocSlot } from "@/libs/constants/screens/request-docs"
import { useHaptic } from "@/libs/haptics"
import {
	useDeleteRequestFile,
	useRequestFileBusy,
	useUploadRequestFile
} from "@/libs/query/hooks/use-requests"
import { createIdempotencyKey } from "@/libs/query/idempotency"
import { errorCatch } from "@/libs/utils"
import { isOffline } from "@/libs/utils/screens/request-create"

/** Загрузка, замена и удаление файла в одном слоте документов заявки */
export const useRequestFile = (requestId: string, slot: RequestDocSlot) => {
	const uploadMutation = useUploadRequestFile(requestId, slot.index)
	const deleteMutation = useDeleteRequestFile(requestId, slot.index)
	const { isUploading, isDeleting } = useRequestFileBusy(requestId, slot.index)
	const { haptic } = useHaptic()

	const [progress, setProgress] = useState(0)

	const { mutateAsync: uploadFile } = uploadMutation
	const { mutateAsync: deleteFile } = deleteMutation

	const fail = useCallback(
		(title: string, error: unknown) => {
			const { message } = errorCatch(error)

			haptic("medium")

			toast.error(title, {
				description: message,
				duration: TOAST_ERROR_DURATION
			})
		},
		[haptic]
	)

	const upload = useCallback(
		async (file: File) => {
			if (isOffline()) {
				toast.error("Нет соединения", {
					description: "Файл нельзя загрузить без сети",
					duration: TOAST_ERROR_DURATION
				})
				return
			}

			if (file.size === 0) {
				toast.error("Файл пустой", {
					description: "Выберите другой файл",
					duration: TOAST_ERROR_DURATION
				})
				return
			}

			setProgress(0)

			try {
				await uploadFile({
					file,
					idempotencyKey: createIdempotencyKey(),
					onProgress: setProgress
				})

				toast.success(`${slot.label}: файл загружен`, {
					duration: TOAST_SUCCESS_DURATION
				})
			} catch (error) {
				fail("Не удалось загрузить файл", error)
			} finally {
				setProgress(0)
			}
		},
		[uploadFile, slot.label, fail]
	)

	const remove = useCallback(async () => {
		if (isOffline()) {
			toast.error("Нет соединения", {
				description: "Файл нельзя удалить без сети",
				duration: TOAST_ERROR_DURATION
			})
			return
		}

		try {
			await deleteFile({
				idempotencyKey: createIdempotencyKey(),
				docKey: slot.key
			})

			toast.success(`${slot.label}: файл удалён`, {
				duration: TOAST_SUCCESS_DURATION
			})
		} catch (error) {
			fail("Не удалось удалить файл", error)
		}
	}, [deleteFile, slot.key, slot.label, fail])

	return { isUploading, isDeleting, progress, upload, remove }
}
