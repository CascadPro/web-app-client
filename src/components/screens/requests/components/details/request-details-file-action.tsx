"use client"

import type { LucideIcon } from "lucide-react"
import type { FC } from "react"

import { cn } from "@/libs/utils"

interface Props {
	icon: LucideIcon
	label: string
	tone?: "default" | "error"
	onClick: () => void
}

/** Иконка-кнопка в строке файла: область нажатия 40×40 */
export const RequestDetailsFileAction: FC<Props> = ({
	icon: Icon,
	label,
	tone = "default",
	onClick
}) => (
	<button
		type="button"
		onClick={onClick}
		aria-label={label}
		title={label}
		className={cn(
			"grid size-10 shrink-0 place-items-center rounded-lg outline-none",
			"transition-colors motion-reduce:transition-none",
			"focus-visible:ring-primary focus-visible:ring-2",
			tone === "error"
				? "text-error active:bg-error/10"
				: "text-on-surface-variant active:bg-primary/10"
		)}
	>
		<Icon size={18} aria-hidden />
	</button>
)
