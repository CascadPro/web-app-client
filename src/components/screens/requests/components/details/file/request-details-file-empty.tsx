"use client"

import { FileIcon, Loader2Icon, PlusIcon } from "lucide-react"
import type { FC } from "react"

interface Props {
	label: string
	isUploading: boolean
	progress: number
	onPick: () => void
}

export const RequestDetailsFileEmpty: FC<Props> = ({
	label,
	isUploading,
	progress,
	onPick
}) => (
	<button
		type="button"
		onClick={onPick}
		disabled={isUploading}
		aria-label={`Прикрепить файл: ${label}`}
		aria-busy={isUploading || undefined}
		className="active:bg-primary/20 hover:bg-primary/10 focus-visible:bg-primary/10 flex min-h-14 w-full items-center gap-3 p-3 text-left transition-colors will-change-auto motion-reduce:transition-none"
	>
		<span className="border-outline/40 text-on-surface-variant grid size-9 shrink-0 place-items-center rounded-lg border border-dashed">
			{isUploading ? (
				<Loader2Icon size={16} className="animate-spin" aria-hidden />
			) : (
				<FileIcon size={16} aria-hidden />
			)}
		</span>

		<span className="min-w-0 flex-1 text-sm">
			{label}

			<span className="text-on-surface-variant block text-xs">
				{isUploading
					? progress > 0
						? `Загрузка ${progress}%`
						: "Загрузка..."
					: "Не прикреплён"}
			</span>
		</span>

		{!isUploading && (
			<span className="text-primary flex shrink-0 items-center gap-1 text-sm font-medium">
				<PlusIcon size={16} aria-hidden />
				Прикрепить
			</span>
		)}
	</button>
)
