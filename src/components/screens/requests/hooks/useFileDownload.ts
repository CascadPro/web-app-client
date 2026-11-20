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
import { useOfflineFilesStore } from "@/store/offline-files"

export interface DownloadTarget {
	fileId?: string
	expectedSize?: number | null
}

export const useFileDownload = () => {
	const { haptic } = useHaptic()

	const [progress, setProgress] = useState<DownloadProgress | null>(null)
	const controllerRef = useRef<AbortController | null>(null)

	useEffect(() => () => controllerRef.current?.abort(), [])

	const cancel = useCallback(() => controllerRef.current?.abort(), [])

	const download = useCallback(
		async (
			url: string,
			filename: string,
			{ fileId, expectedSize }: DownloadTarget = {}
		) => {
			if (controllerRef.current) return

			const controller = new AbortController()

			controllerRef.current = controller

			try {
				const offline = useOfflineFilesStore.getState()

				if (fileId) {
					const copy = await offline.read(fileId, expectedSize)

					if (copy) {
						saveBlob(copy.blob, filename)
						return
					}
				}

				if (isOffline()) {
					toast.error("Нет соединения", {
						description: "Файла нет на устройстве, а без сети его не скачать",
						duration: TOAST_ERROR_DURATION
					})
					return
				}

				setProgress({ loaded: 0, total: null })

				const { blob } = await downloadFile(url, {
					signal: controller.signal,
					fetchImpl: authorizedFetch,
					onProgress: setProgress
				})

				saveBlob(blob, filename)

				if (fileId && (!expectedSize || blob.size === expectedSize)) {
					void offline.save({
						id: fileId,
						blob,
						name: filename,
						type: blob.type
					})
				}
			} catch (error) {
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
