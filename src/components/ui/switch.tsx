"use client"

import { m, useReducedMotion } from "motion/react"
import { type ButtonHTMLAttributes, forwardRef, type MouseEvent } from "react"

import { cn } from "@/libs/utils"

export interface SwitchProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	checked: boolean
	onCheckedChange: (checked: boolean) => void
	label?: string
	isLoading?: boolean
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
	(
		{ checked, onCheckedChange, isLoading, disabled, label, onClick, ...props },
		ref
	) => {
		const reduceMotion = useReducedMotion()

		const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
			onCheckedChange(!checked)
			onClick?.(event)
		}

		return (
			<button
				ref={ref}
				type="button"
				role="switch"
				aria-checked={checked}
				aria-label={label}
				onClick={handleClick}
				className={cn(
					"bg-outline/20 relative inline-flex h-7 w-14 shrink-0 items-center rounded-full",
					"focus-visible:outline-primary focus-visible:outline-2 focus-visible:outline-offset-2",
					"disabled:cursor-not-allowed disabled:opacity-50",
					"transition-colors will-change-auto motion-reduce:transition-none",
					{ "bg-primary": checked }
				)}
				{...props}
				disabled={disabled || isLoading}
			>
				<m.span
					aria-hidden="true"
					animate={{ x: checked ? 30 : 2 }}
					whileTap={{ scale: 1.6 }}
					transition={
						reduceMotion
							? { duration: 0 }
							: { type: "spring", stiffness: 750, mass: 1, damping: 24 }
					}
					className="glass glass-highlight size-6 rounded-full shadow-sm will-change-auto"
				/>
			</button>
		)
	}
)
