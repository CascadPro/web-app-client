import { useEffect, useRef, useState } from "react"

import {
	CONFIRM_FILE_DELETE_TIMEOUT,
	FILE_KIND_ICON
} from "@/libs/constants/screens/requests"
import {
	formatDownloadProgress,
	formatFileSize,
	getFileExtension,
	getFileKind
} from "@/libs/utils/screens/request-details"
import { formatRequestDate } from "@/libs/utils/screens/requests"

import { RequestFileItemProps } from "../types/request-file-item"

type Props = Pick<
	RequestFileItemProps,
	"progress" | "download" | "file" | "isUploading" | "isDeleting"
>

export const useRequestFileItem = ({
	download,
	isUploading,
	isDeleting,
	file,
	progress
}: Props) => {
	const [isConfirming, setIsConfirming] = useState(false)

	const { isDownloading } = download
	const isBusy = isUploading || isDeleting || isDownloading

	const extension = getFileExtension(file.filename)
	const kind = getFileKind(extension)
	const Icon = FILE_KIND_ICON[kind]

	const getMeta = (): string => {
		if (isDownloading) {
			return formatDownloadProgress(download.loaded, download.total)
		}

		if (isUploading) return progress > 0 ? `Загрузка ${progress}%` : "Загрузка…"

		if (isDeleting) return "Удаление…"

		return [
			extension.toUpperCase(),
			formatFileSize(file.size),
			file.created_at ? formatRequestDate(file.created_at) : ""
		]
			.filter(Boolean)
			.join(" · ")
	}

	const meta = getMeta()

	const timeoutId = useRef<NodeJS.Timeout | null>(null)

	useEffect(() => {
		if (isConfirming) {
			timeoutId.current = setTimeout(() => {
				setIsConfirming(false)
			}, CONFIRM_FILE_DELETE_TIMEOUT)
		}

		return () => {
			clearTimeout(timeoutId.current as NodeJS.Timeout)
		}
	}, [isConfirming])

	return {
		Icon,
		meta,
		kind,
		isBusy,
		isDownloading,
		isConfirming,
		setIsConfirming
	}
}
