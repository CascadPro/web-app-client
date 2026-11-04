"use client"

import type { LucideIcon } from "lucide-react"
import { type FC, type PropsWithChildren, useId } from "react"

import { cn } from "@/libs/utils"

interface Props extends PropsWithChildren {
	icon: LucideIcon
	title: string
	/** Короткая сводка справа от заголовка, например «2/4» */
	count?: string
	/** Строки отделяются тонкой линией (для списков) */
	divided?: boolean
}

/** Заголовок + «сгруппированный список» — единый вид всех блоков «Подробнее» */
export const RequestDetailsSection: FC<Props> = ({
	icon: Icon,
	title,
	count,
	divided,
	children
}) => {
	const id = useId()

	return (
		<section aria-labelledby={id}>
			<h3
				id={id}
				className="text-on-surface-variant mb-2 flex items-center gap-1.5 px-1 text-sm font-medium"
			>
				<Icon size={16} aria-hidden />

				{title}

				{count && (
					<span className="ml-auto text-xs font-normal tabular-nums">
						{count}
					</span>
				)}
			</h3>

			<div
				className={cn(
					"bg-surface-variant/40 border-outline/20 overflow-hidden rounded-2xl border",
					divided && "divide-outline/15 divide-y"
				)}
			>
				{children}
			</div>
		</section>
	)
}
