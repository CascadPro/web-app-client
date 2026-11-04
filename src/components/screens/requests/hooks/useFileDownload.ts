"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { authorizedFetch } from "@/api/authorized-fetch"
import { toast, TOAST_ERROR_DURATION } from "@/components/ui/toast"
import { useHaptic } from "@/libs/haptics"
import { isOffline } from "@/libs/utils/screens/request-create"
import {
	downloadFile,
	type DownloadProgress,
	getDownloadErrorMessage,
	isAbortError,
	saveBlob,
	toPercent
} from "@/libs/utils/screens/request-details"

/**
 * Скачивание файла с прогрессом: поток, процент, «сколько из скольки», отмена.
 * Если закрыть шторку посреди скачивания, оно отменяется — файл не «выскочит» позже.
 */
export const useFileDownload = () => {
	const { haptic } = useHaptic()

	// null — скачивание не идёт
	const [progress, setProgress] = useState<DownloadProgress | null>(null)
	const controllerRef = useRef<AbortController | null>(null)

	useEffect(() => () => controllerRef.current?.abort(), [])

	const cancel = useCallback(() => controllerRef.current?.abort(), [])

	const download = useCallback(
		async (url: string, filename: string) => {
			if (controllerRef.current) return

			if (isOffline()) {
				toast.error("Нет соединения", {
					description: "Файл нельзя скачать без сети",
					duration: TOAST_ERROR_DURATION
				})
				return
			}

			const controller = new AbortController()

			controllerRef.current = controller
			setProgress({ loaded: 0, total: null })

			try {
				const { blob } = await downloadFile(url, {
					signal: controller.signal,
					fetchImpl: authorizedFetch,
					onProgress: setProgress
				})

				saveBlob(blob, filename)
			} catch (error) {
				// Отмена — решение пользователя, а не ошибка
				if (isAbortError(error)) return

				haptic("medium")

				toast.error("Не удалось скачать файл", {
					description: getDownloadErrorMessage(error),
					duration: TOAST_ERROR_DURATION
				})
			} finally {
				controllerRef.current = null
				setProgress(null)
			}
		},
		[haptic]
	)

	return {
		isDownloading: progress !== null,
		loaded: progress?.loaded ?? 0,
		total: progress?.total ?? null,
		percent: progress ? toPercent(progress.loaded, progress.total) : null,
		download,
		cancel
	}
}
