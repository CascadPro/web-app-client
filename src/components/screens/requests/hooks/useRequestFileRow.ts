import { type ChangeEvent, useCallback, useRef } from "react"

import type { RequestHttpDtoGetRequestResponseDocsFile as RequestFile } from "@/api/generated"
import { MEDIA_URL } from "@/libs/constants"
import type { RequestDocSlot } from "@/libs/constants/screens/requests"
import { useIsFileOffline } from "@/libs/hooks/use-offline-files"
import { getRequestFileUrl } from "@/libs/utils/screens/request-details"

import { useFileDownload } from "./useFileDownload"
import { useRequestFile } from "./useRequestFile"

export const useRequestFileRow = (
	requestId: string,
	slot: RequestDocSlot,
	file?: RequestFile
) => {
	const { isUploading, isDeleting, progress, upload, remove } = useRequestFile(
		requestId,
		slot,
		file?.id
	)

	const isSavedOffline = useIsFileOffline(file?.id)

	const { isDownloading, percent, loaded, total, download, cancel } =
		useFileDownload()

	const inputRef = useRef<HTMLInputElement>(null)

	const hasFile = Boolean(file?.id || file?.filename)

	const url = file ? getRequestFileUrl(file, MEDIA_URL) : null

	const open = () => {
		if (url) {
			void download(url, file?.filename || "file", {
				fileId: file?.id,
				expectedSize: file?.size
			})
		}
	}

	const pick = () => inputRef.current?.click()

	const handleChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			const selected = event.target.files?.[0]

			event.target.value = ""

			if (selected) void upload(selected)
		},
		[upload]
	)

	return {
		inputRef,
		url,
		total,
		loaded,
		percent,
		progress,
		hasFile,
		isDeleting,
		isUploading,
		isDownloading,
		isSavedOffline,
		pick,
		open,
		remove,
		cancel,
		handleChange
	}
}
