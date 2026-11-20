"use client"

import type { LucideIcon } from "lucide-react"
import { type FC, type PropsWithChildren, useId } from "react"

import { Title } from "@/components/ui"
import { cn } from "@/libs/utils"

interface Props extends PropsWithChildren {
	icon: LucideIcon
	title: string
	count?: string
	divided?: boolean
}

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
			<Title
				id={id}
				size="md"
				className="text-on-surface-variant mb-2 flex items-center gap-1.5 px-1 text-sm leading-5"
			>
				<Icon size={16} aria-hidden />

				{title}

				{count && (
					<span className="animate-fade-up ml-auto text-xs font-normal tabular-nums">
						{count}
					</span>
				)}
			</Title>

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
