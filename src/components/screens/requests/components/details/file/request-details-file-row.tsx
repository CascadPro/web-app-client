"use client"

import { AnimatePresence, m } from "motion/react"
import type { FC } from "react"
import { useMemo } from "react"

import type { RequestHttpDtoGetRequestResponseDocsFile } from "@/api/generated"
import type { RequestDocSlot } from "@/libs/constants/screens/requests/request-docs"
import { DURATION, EASE_OUT, INSTANT, useReduceMotion } from "@/libs/motion"
import { cn } from "@/libs/utils"

import { useRequestFileRow } from "../../../hooks/useRequestFileRow"

import { RequestDetailsFileEmpty } from "./request-details-file-empty"
import { RequestDetailsFileItem } from "./request-details-file-item"

interface Props {
	requestId: string
	slot: RequestDocSlot
	file?: RequestHttpDtoGetRequestResponseDocsFile
}

export const RequestDetailsFileRow: FC<Props> = ({ requestId, slot, file }) => {
	const reduceMotion = useReduceMotion()
	const {
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
	} = useRequestFileRow(requestId, slot, file)

	const progressTransition = useMemo(
		() => (reduceMotion ? INSTANT : { duration: DURATION.fast, ease: EASE_OUT }),
		[reduceMotion]
	)

	const initial = reduceMotion ? undefined : { opacity: 0 }
	const exit = reduceMotion ? undefined : { opacity: 0 }
	const transition = reduceMotion ? INSTANT : { duration: DURATION.fast }

	return (
		<div className="relative overflow-hidden">
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
					isSavedOffline={isSavedOffline}
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
						initial={initial}
						animate={{ opacity: 1 }}
						exit={exit}
						transition={transition}
						role="progressbar"
						aria-label={`Загрузка файла: ${slot.label}`}
						aria-valuemin={0}
						aria-valuemax={100}
						aria-valuenow={progress}
						className="bg-outline/20 absolute inset-x-0 bottom-0 h-0.5"
					>
						<m.div
							initial={false}
							animate={{ scaleX: Math.max(progress, 8) / 100 }}
							transition={progressTransition}
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
