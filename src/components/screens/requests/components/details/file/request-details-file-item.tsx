"use client"

import { Loader2Icon, Trash2Icon, UploadIcon, XIcon } from "lucide-react"
import { AnimatePresence, m } from "motion/react"
import type { FC } from "react"

import { Button } from "@/components/ui"
import { CONFIRM_FILE_DELETE_TIMEOUT } from "@/libs/constants/screens/requests"
import { DURATION } from "@/libs/motion"
import { cn } from "@/libs/utils"

import { useRequestFileItem } from "../../../hooks/useRequestFileItem"
import { RequestFileItemProps } from "../../../types/request-file-item"

import { RequestDetailsFileAction } from "./request-details-file-action"
import { RequestDetailsFileContent } from "./request-details-file-content"

const ROW =
	"flex min-h-14 min-w-0 flex-1 items-center gap-3 px-3 py-2 text-left outline-none"

export const RequestDetailsFileItem: FC<RequestFileItemProps> = ({
	label,
	isSavedOffline,
	canOpen,
	onOpen,
	onCancelDownload,
	onReplace,
	onDelete,
	...props
}) => {
	const {
		Icon,
		isBusy,
		isConfirming,
		isDownloading,
		kind,
		meta,
		setIsConfirming
	} = useRequestFileItem(props)

	const content = (
		<RequestDetailsFileContent
			Icon={Icon}
			percent={props.download.percent}
			kind={kind}
			filename={props.file.filename}
			meta={meta}
			isDownloading={isDownloading}
			isBusy={isBusy}
			label={label}
			isSavedOffline={isSavedOffline}
		/>
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
					aria-label={`Удалить файл ${props.file.filename}?`}
					className="relative flex min-h-14 items-center gap-2 px-(--mini-row-padding-x) py-(--mini-row-padding-y)"
				>
					<p
						className="min-w-0 flex-1 truncate text-sm"
						title={props.file.filename}
					>
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

					<m.div
						aria-hidden="true"
						className="bg-primary/50 absolute inset-x-0 bottom-0 h-0.5 origin-left"
						initial={{ scaleX: 1 }}
						animate={{ scaleX: 0 }}
						transition={{
							duration: (CONFIRM_FILE_DELETE_TIMEOUT - 280) / 1000,
							ease: "linear"
						}}
					/>
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
							aria-label={`${label}: ${props.file.filename}. Скачать`}
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
