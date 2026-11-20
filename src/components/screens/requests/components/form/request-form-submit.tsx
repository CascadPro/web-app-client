"use client"

import { CheckIcon, ClockIcon, type LucideIcon, SendIcon } from "lucide-react"
import type { FC } from "react"

import { Button } from "@/components/ui"
import { cn } from "@/libs/utils"
import type { RequestCreateStatus } from "@/types/screens/requests"

interface Props {
	status: RequestCreateStatus
	/** id формы: кнопка стоит в footer шторки, вне <form> */
	formId: string
	labels: Record<RequestCreateStatus, string>
	idleIcon?: LucideIcon
	disabled?: boolean
}

export const RequestFormSubmit: FC<Props> = ({
	status,
	formId,
	labels,
	idleIcon = SendIcon,
	disabled
}) => {
	const Icon =
		status === "success"
			? CheckIcon
			: status === "queued"
				? ClockIcon
				: idleIcon

	return (
		<Button
			type="submit"
			form={formId}
			className={cn(
				"min-w-0 flex-1 gap-2 p-3",
				status === "error" && "animate-shake"
			)}
			isLoading={status === "loading"}
			disabled={disabled || status === "success" || status === "queued"}
		>
			<Icon key={status} size={18} className="animate-pop" />

			{labels[status]}
		</Button>
	)
}
