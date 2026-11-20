"use client"

import { CircleAlertIcon, RefreshCwIcon } from "lucide-react"
import type { FC } from "react"

import { Button } from "@/components/ui"
import { cn } from "@/libs/utils"

interface Props {
	onRetry: () => void
	isRetrying?: boolean
	title?: string
	compact?: boolean
}

export const RequestSheetError: FC<Props> = ({
	onRetry,
	isRetrying,
	title = "Не удалось загрузить заявку",
	compact
}) => (
	<div
		role="alert"
		className={cn(
			"flex flex-col items-center gap-3 text-center",
			compact ? "py-6" : "py-12"
		)}
	>
		<span className="bg-error/10 text-error grid size-12 place-items-center rounded-full">
			<CircleAlertIcon size={24} aria-hidden />
		</span>

		<div>
			<p className="font-medium">{title}</p>
			<p className="text-on-surface-variant text-sm">
				Проверьте соединение и попробуйте ещё раз
			</p>
		</div>

		<Button
			variant="default-2"
			className="gap-2 px-4 py-2"
			isLoading={isRetrying}
			onClick={onRetry}
		>
			<RefreshCwIcon size={16} aria-hidden />
			Повторить
		</Button>
	</div>
)
