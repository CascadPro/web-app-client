"use client"

import { Loader2Icon, Trash2Icon, UploadIcon, XIcon } from "lucide-react"
import { AnimatePresence, m } from "motion/react"
import { type FC, useState } from "react"

import type { RequestHttpDtoGetRequestResponseDocsFile } from "@/api/generated"
import { Button } from "@/components/ui"
import {
	FILE_KIND_ICON,
	FILE_KIND_STYLE
} from "@/libs/constants/screens/request-details"
import { DURATION } from "@/libs/motion"
import { cn } from "@/libs/utils"
import {
	formatDownloadProgress,
	formatFileSize,
	getFileExtension,
	getFileKind
} from "@/libs/utils/screens/request-details"
import { formatRequestDate } from "@/libs/utils/screens/requests"

import { RequestDetailsFileAction } from "./request-details-file-action"
import { RequestDetailsFileProgress } from "./request-details-file-progress"

export interface FileDownloadState {
	isDownloading: boolean
	/** 0–100, null — размер неизвестен */
	percent: number | null
	loaded: number
	total: number | null
}

interface Props {
	label: string
	file: RequestHttpDtoGetRequestResponseDocsFile
	isUploading: boolean
	isDeleting: boolean
	/** Прогресс загрузки (замены) файла, 0–100 */
	progress: number
	download: FileDownloadState
	/** Есть ли адрес, по которому файл можно скачать */
	canOpen: boolean
	onOpen: () => void
	onCancelDownload: () => void
	onReplace: () => void
	onDelete: () => void
}

const ROW =
	"flex min-h-14 min-w-0 flex-1 items-center gap-3 px-3 py-2 text-left outline-none"

/** Прикреплённый файл: скачать (с прогрессом), заменить, удалить (с подтверждением) */
export const RequestDetailsFileItem: FC<Props> = ({
	label,
	file,
	isUploading,
	isDeleting,
	progress,
	download,
	canOpen,
	onOpen,
	onCancelDownload,
	onReplace,
	onDelete
}) => {
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

	const content = (
		<>
			{isDownloading ? (
				<RequestDetailsFileProgress
					value={download.percent}
					label={`Скачивание: ${label}`}
					className="text-primary"
				>
					<Icon size={14} aria-hidden />
				</RequestDetailsFileProgress>
			) : (
				<span
					className={cn(
						"grid size-9 shrink-0 place-items-center rounded-lg",
						FILE_KIND_STYLE[kind]
					)}
				>
					<Icon size={18} aria-hidden />
				</span>
			)}

			<span className="min-w-0 flex-1">
				<span className="text-on-surface-variant block text-xs">{label}</span>

				<span className="block truncate text-sm font-medium">
					{file.filename}
				</span>

				{meta && (
					<span className="text-on-surface-variant block truncate text-xs tabular-nums">
						{meta}
					</span>
				)}
			</span>
		</>
	)

	return (
		<AnimatePresence initial={false} mode="wait">
			{isConfirming ? (
				<m.div
					key="confirm"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: DURATION.fast }}
					role="alertdialog"
					aria-label={`Удалить файл ${file.filename}?`}
					className="flex min-h-14 items-center gap-2 px-3 py-2"
				>
					<p className="min-w-0 flex-1 truncate text-sm" title={file.filename}>
						Удалить файл?
					</p>

					<Button
						variant="default-2"
						className="px-3 py-2 text-sm"
						onClick={() => setIsConfirming(false)}
					>
						Отмена
					</Button>

					<Button
						variant="destructive"
						className="px-3 py-2 text-sm"
						onClick={() => {
							setIsConfirming(false)
							onDelete()
						}}
					>
						Удалить
					</Button>
				</m.div>
			) : (
				<m.div
					key="row"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: DURATION.fast }}
					className="flex items-center"
				>
					{canOpen && !isBusy ? (
						<button
							type="button"
							onClick={onOpen}
							aria-label={`${label}: ${file.filename}. Скачать`}
							className={cn(
								ROW,
								"active:bg-primary/10 focus-visible:bg-primary/10 transition-colors motion-reduce:transition-none"
							)}
						>
							{content}
						</button>
					) : (
						<div className={ROW} aria-busy={isBusy || undefined}>
							{content}
						</div>
					)}

					<div className="flex shrink-0 items-center pr-1">
						{isDownloading ? (
							<RequestDetailsFileAction
								icon={XIcon}
								label={`Отменить скачивание: ${label}`}
								onClick={onCancelDownload}
							/>
						) : isBusy ? (
							<span className="text-on-surface-variant grid size-10 place-items-center">
								<Loader2Icon size={18} className="animate-spin" aria-hidden />
							</span>
						) : (
							<>
								<RequestDetailsFileAction
									icon={UploadIcon}
									label={`Заменить файл: ${label}`}
									onClick={onReplace}
								/>

								<RequestDetailsFileAction
									icon={Trash2Icon}
									label={`Удалить файл: ${label}`}
									tone="error"
									onClick={() => setIsConfirming(true)}
								/>
							</>
						)}
					</div>
				</m.div>
			)}
		</AnimatePresence>
	)
}
