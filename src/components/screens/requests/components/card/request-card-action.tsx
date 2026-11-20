"use client"

import { Loader2Icon } from "lucide-react"
import { m, type Variants } from "motion/react"
import type { FC } from "react"
import { useMemo } from "react"

import { DURATION, EASE_OUT, INSTANT, useReduceMotion } from "@/libs/motion"
import { cn } from "@/libs/utils"

import type {
	RequestActionTone,
	RequestCardAction
} from "../../hooks/useRequestCardActions"

const createActionItemVariants = (reduceMotion: boolean): Variants => {
	if (reduceMotion) {
		return {
			hidden: { opacity: 0 },
			visible: { opacity: 1, transition: INSTANT }
		}
	}

	return {
		hidden: { opacity: 0, y: 6 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: DURATION.base, ease: EASE_OUT }
		}
	}
}

const TONE: Record<RequestActionTone, { icon: string; label: string }> = {
	default: { icon: "bg-primary/10 text-primary", label: "" },
	success: { icon: "bg-success/10 text-success", label: "text-success" },
	error: { icon: "bg-error/10 text-error", label: "text-error" }
}

type Props = Omit<RequestCardAction, "key">

export const actionItemVariants = createActionItemVariants(false)

export const RequestCardActionItem: FC<Props> = ({
	title,
	Icon,
	tone,
	loading,
	disabled,
	hint,
	onClick
}) => {
	const reduceMotion = useReduceMotion()
	const actionItemVariants = useMemo(() => createActionItemVariants(reduceMotion), [reduceMotion])

	return (
		<m.button
			type="button"
			variants={actionItemVariants}
			onClick={onClick}
			disabled={disabled || loading}
			aria-busy={loading || undefined}
			className={cn(
				"flex min-h-12 w-full items-center gap-3 rounded-xl px-2 py-1.5 text-left text-sm font-medium outline-none",
				"transition-colors motion-reduce:transition-none",
				"hover:bg-outline/10 active:bg-outline/20 focus-visible:ring-primary focus-visible:ring-2",
				"disabled:pointer-events-none",
				disabled && !loading && "opacity-50",
				TONE[tone].label
			)}
		>
			<span
				className={cn(
					"grid size-8 shrink-0 place-items-center rounded-lg",
					TONE[tone].icon
				)}
			>
				{loading ? (
					<Loader2Icon size={16} className="animate-spin" aria-hidden />
				) : (
					<Icon size={18} aria-hidden />
				)}
			</span>

			<span className="min-w-0 flex-1">
				{title}

				{hint && (
					<span className="text-on-surface-variant block text-xs font-normal">
						{hint}
					</span>
				)}
			</span>
		</m.button>
	)
}
