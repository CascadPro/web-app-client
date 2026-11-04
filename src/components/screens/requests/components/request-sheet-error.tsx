"use client"

import { CircleAlertIcon, RefreshCwIcon } from "lucide-react"
import type { FC } from "react"

import { Button } from "@/components/ui"

interface Props {
	onRetry: () => void
	isRetrying?: boolean
}

export const RequestSheetError: FC<Props> = ({ onRetry, isRetrying }) => (
	<div
		role="alert"
		className="flex flex-col items-center gap-3 py-12 text-center"
	>
		<span className="bg-error/10 text-error grid size-12 place-items-center rounded-full">
			<CircleAlertIcon size={24} aria-hidden />
		</span>

		<div>
			<p className="font-medium">Не удалось загрузить заявку</p>
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
