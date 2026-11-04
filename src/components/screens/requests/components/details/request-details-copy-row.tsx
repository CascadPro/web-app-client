"use client"

import {
	ArrowUpRightIcon,
	CheckIcon,
	CopyIcon,
	type LucideIcon
} from "lucide-react"
import type { FC } from "react"

import { useClipboardCopy } from "@/libs/hooks"

interface Props {
	icon: LucideIcon
	value: string
	label?: string
	/** Дополнительное действие: mailto:, tel: */
	href?: string
	hrefLabel?: string
}

/** Строка со значением: нажатие копирует, справа — быстрый переход (почта, звонок) */
export const RequestDetailsCopyRow: FC<Props> = ({
	icon: Icon,
	value,
	label,
	href,
	hrefLabel
}) => {
	const [isCopied, copy] = useClipboardCopy()

	return (
		<div className="flex items-center">
			<button
				type="button"
				onClick={() => void copy(value)}
				aria-label={`Скопировать: ${value}`}
				className="active:bg-primary/10 focus-visible:bg-primary/10 flex min-h-12 min-w-0 flex-1 items-center gap-3 px-3 py-2 text-left transition-colors outline-none motion-reduce:transition-none"
			>
				<span className="bg-primary/10 text-primary grid size-8 shrink-0 place-items-center rounded-lg">
					<Icon size={16} aria-hidden />
				</span>

				<span className="min-w-0 flex-1">
					{label && (
						<span className="text-on-surface-variant block text-xs">
							{label}
						</span>
					)}

					<span className="block text-sm break-words">{value}</span>
				</span>

				<span aria-hidden className="text-on-surface-variant shrink-0">
					{isCopied ? (
						<CheckIcon size={16} className="text-success animate-pop" />
					) : (
						<CopyIcon size={16} />
					)}
				</span>

				<span role="status" className="sr-only">
					{isCopied ? "Скопировано" : ""}
				</span>
			</button>

			{href && (
				<a
					href={href}
					aria-label={hrefLabel}
					className="text-primary active:bg-primary/10 focus-visible:bg-primary/10 grid min-h-12 shrink-0 place-items-center px-3 transition-colors outline-none motion-reduce:transition-none"
				>
					<ArrowUpRightIcon size={18} aria-hidden />
				</a>
			)}
		</div>
	)
}
