"use client"

import { m } from "motion/react"

import { Button } from "@/components/ui/button"
import { cn } from "@/libs/utils"

import { useSegmentedControl } from "./hooks/useSegmentedControl"
import type { SegmentedControlProps, SegmentedControlSize } from "./types"

const ITEM_SIZE: Record<SegmentedControlSize, string> = {
	md: "px-3 py-2",
	sm: "px-2.5 py-1.5"
}

export const SegmentedControl = <T extends string>({
	value,
	options,
	label,
	onChange,
	size = "md",
	className
}: SegmentedControlProps<T>) => {
	const { containerRef, left, top, width, height, ready, itemRefs } =
		useSegmentedControl(value, options)

	return (
		<fieldset
			ref={containerRef}
			aria-label={label}
			className={cn(
				"bg-surface-variant/60 relative m-0 flex max-w-full min-w-0 flex-wrap gap-1 rounded-xl border-0 p-1",
				className
			)}
		>
			<m.span
				aria-hidden
				className="glass-lite bg-primary/90 pointer-events-none absolute top-0 left-0 rounded-xl will-change-transform"
				style={{
					x: left,
					y: top,
					width,
					height,
					opacity: ready ? 1 : 0
				}}
			/>

			{options.map(option => {
				const active = value === option.value

				return (
					<Button
						key={option.value}
						ref={el => {
							if (el) itemRefs.current.set(option.value, el)
							else itemRefs.current.delete(option.value)
						}}
						variant="ghost"
						aria-pressed={active}
						onClick={active ? undefined : () => onChange(option.value)}
						className={cn(
							"text-on-surface-variant relative z-10 flex-1 rounded-lg bg-transparent",
							ITEM_SIZE[size],
							"hover:text-on-surface transition-ui will-change-auto hover:bg-transparent",
							"focus-visible:ring-primary focus-visible:ring-2",
							"active:scale-95",
							{ "text-on-primary hover:text-on-primary": active }
						)}
					>
						{option.label}
					</Button>
				)
			})}
		</fieldset>
	)
}
