"use client"

import type { FC, PropsWithChildren } from "react"

import { cn } from "@/libs/utils"

interface Props extends PropsWithChildren {
	value: number | null
	label: string
	className?: string
}

const RADIUS = 15
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

/** Круговой индикатор прогресса вокруг значка файла (36×36) */
export const RequestDetailsFileProgress: FC<Props> = ({
	value,
	label,
	className,
	children
}) => (
	<span
		role="progressbar"
		aria-label={label}
		aria-valuemin={0}
		aria-valuemax={100}
		aria-valuenow={value ?? undefined}
		className={cn(
			"relative grid size-9 shrink-0 place-items-center",
			className
		)}
	>
		<svg
			viewBox="0 0 36 36"
			aria-hidden
			className={cn(
				"absolute inset-0 -rotate-90",
				value === null && "animate-spin motion-reduce:animate-none"
			)}
		>
			<circle
				cx="18"
				cy="18"
				r={RADIUS}
				fill="none"
				strokeWidth="3"
				stroke="currentColor"
				className="text-outline/30"
			/>

			<circle
				cx="18"
				cy="18"
				r={RADIUS}
				fill="none"
				strokeWidth="3"
				strokeLinecap="round"
				stroke="currentColor"
				strokeDasharray={CIRCUMFERENCE}
				strokeDashoffset={CIRCUMFERENCE * (1 - (value ?? 25) / 100)}
				style={{ transition: "stroke-dashoffset 120ms linear" }}
				className="text-primary motion-reduce:transition-none"
			/>
		</svg>

		<span className="relative">{children}</span>
	</span>
)
