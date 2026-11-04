"use client"

import { AnimatePresence, m } from "motion/react"
import { type ChangeEvent, type FC, useRef } from "react"

import type { RequestHttpDtoGetRequestResponseDocsFile } from "@/api/generated"
import { MEDIA_URL } from "@/libs/constants"
import type { RequestDocSlot } from "@/libs/constants/screens/request-docs"
import { DURATION, EASE_OUT } from "@/libs/motion"
import { cn } from "@/libs/utils"
import { getRequestFileUrl } from "@/libs/utils/screens/request-details"

import { useFileDownload } from "../../hooks/useFileDownload"
import { useRequestFile } from "../../hooks/useRequestFile"

import { RequestDetailsFileEmpty } from "./request-details-file-empty"
import { RequestDetailsFileItem } from "./request-details-file-item"

interface Props {
	requestId: string
	slot: RequestDocSlot
	file?: RequestHttpDtoGetRequestResponseDocsFile
}

/** Один слот документов: пустой (можно прикрепить) или с файлом (открыть, заменить, удалить) */
export const RequestDetailsFileRow: FC<Props> = ({ requestId, slot, file }) => {
	const { isUploading, isDeleting, progress, upload, remove } = useRequestFile(
		requestId,
		slot
	)

	const { isDownloading, percent, loaded, total, download, cancel } =
		useFileDownload()

	const inputRef = useRef<HTMLInputElement>(null)

	const hasFile = Boolean(file?.id || file?.filename)

	const url = file ? getRequestFileUrl(file, MEDIA_URL) : null

	const open = () => {
		if (url) void download(url, file?.filename || "file")
	}

	const pick = () => inputRef.current?.click()

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		const selected = event.target.files?.[0]

		// Сброс значения: повторный выбор того же файла тоже вызовет onChange
		event.target.value = ""

		if (selected) void upload(selected)
	}

	return (
		<div className="relative">
			<input
				ref={inputRef}
				type="file"
				hidden
				tabIndex={-1}
				aria-hidden="true"
				onChange={handleChange}
			/>

			{hasFile && file ? (
				<RequestDetailsFileItem
					label={slot.label}
					file={file}
					isUploading={isUploading}
					isDeleting={isDeleting}
					progress={progress}
					download={{ isDownloading, percent, loaded, total }}
					canOpen={Boolean(url)}
					onOpen={open}
					onCancelDownload={cancel}
					onReplace={pick}
					onDelete={() => void remove()}
				/>
			) : (
				<RequestDetailsFileEmpty
					label={slot.label}
					isUploading={isUploading}
					progress={progress}
					onPick={pick}
				/>
			)}

			<AnimatePresence initial={false}>
				{isUploading && (
					<m.div
						key="progress"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: DURATION.fast }}
						role="progressbar"
						aria-label={`Загрузка файла: ${slot.label}`}
						aria-valuemin={0}
						aria-valuemax={100}
						aria-valuenow={progress}
						className="bg-outline/20 absolute inset-x-0 bottom-0 h-0.5"
					>
						{/* scaleX вместо width: прогресс не вызывает layout; при неизвестном прогрессе — пульсация */}
						<m.div
							initial={false}
							animate={{ scaleX: Math.max(progress, 8) / 100 }}
							transition={{ duration: DURATION.fast, ease: EASE_OUT }}
							className={cn(
								"bg-primary h-full origin-left",
								progress === 0 && "animate-pulse"
							)}
						/>
					</m.div>
				)}
			</AnimatePresence>
		</div>
	)
}
