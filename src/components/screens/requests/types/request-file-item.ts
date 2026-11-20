import { LucideIcon } from "lucide-react"

import type { RequestHttpDtoGetRequestResponseDocsFile as RequestFile } from "@/api/generated"
import { FileKind } from "@/libs/utils/screens/request-details"

export interface FileDownloadState {
	isDownloading: boolean
	/** 0–100, null — размер неизвестен */
	percent: number | null
	loaded: number
	total: number | null
}

export interface RequestFileItemProps {
	label: string
	file: RequestFile
	isUploading: boolean
	isDeleting: boolean
	/** Прогресс загрузки (замены) файла, 0–100 */
	progress: number
	download: FileDownloadState
	/** Есть копия на устройстве: файл откроется сразу и без сети */
	isSavedOffline: boolean
	/** Есть ли адрес, по которому файл можно скачать */
	canOpen: boolean
	onOpen: () => void
	onCancelDownload: () => void
	onReplace: () => void
	onDelete: () => void
}

export interface RequestFileContentProps extends Pick<
	RequestFileItemProps,
	"label" | "isSavedOffline"
> {
	Icon: LucideIcon
	percent: number | null
	kind: FileKind
	filename: string | undefined
	meta: string
	isDownloading: boolean
	isBusy: boolean
}
