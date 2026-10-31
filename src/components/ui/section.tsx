"use client"

import type { LucideIcon } from "lucide-react"
import { m } from "motion/react"
import type { FC, PropsWithChildren } from "react"

import { Title } from "@/components/ui"
import { DURATION, EASE_OUT, useLowPerf, useReduceMotion } from "@/libs/motion"
import { cn } from "@/libs/utils"

interface Props extends PropsWithChildren {
	id: string
	title: string
	description?: string
	icon?: LucideIcon
	className?: string
	renderContainer?: boolean
}

export const Section: FC<Props> = ({
	id,
	title,
	description,
	icon: Icon,
	className,
	renderContainer = true,
	children
}) => {
	const reduceMotion = useReduceMotion()
	const lowPerf = useLowPerf()

	return (
		<m.section
			initial={reduceMotion || lowPerf ? false : { opacity: 0, y: 10 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, amount: "some" }}
			transition={{
				duration: reduceMotion ? 0 : DURATION.slow,
				ease: EASE_OUT
			}}
			aria-labelledby={`${id}-title`}
			className={cn("relative min-w-0 space-y-3", className)}
		>
			<div className="flex items-center gap-3 px-1">
				{Icon && (
					<div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-xl">
						<Icon aria-hidden="true" size={20} />
					</div>
				)}

				<div className="min-w-0">
					<Title
						size="lg"
						id={`${id}-title`}
						className="text-on-surface text-lg"
					>
						{title}
					</Title>

					{description && (
						<p className="text-on-surface-variant text-sm">{description}</p>
					)}
				</div>
			</div>

			{renderContainer ? (
				<div className="border-outline/20 bg-surface divide-outline/10 divide-y overflow-hidden rounded-2xl border shadow-sm">
					{children}
				</div>
			) : (
				children
			)}
		</m.section>
	)
}
