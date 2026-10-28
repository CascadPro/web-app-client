import { m } from "motion/react"

import { Button } from "@/components/ui"
import { cn } from "@/libs/utils"
import { SettingsOption } from "@/types/screens/settings"

import { useSegmentedControl } from "../hooks/useSegmentedControl"

interface SettingsSegmentedControlProps<T extends string> {
	value: T
	options: SettingsOption<T>[]
	label: string
	onChange: (value: T) => void
}

export const SettingsSegmentedControl = <T extends string>({
	value,
	options,
	label,
	onChange
}: SettingsSegmentedControlProps<T>) => {
	const { containerRef, left, top, width, height, ready, itemRefs } =
		useSegmentedControl(value, options)

	return (
		<fieldset
			ref={containerRef}
			aria-label={label}
			className="bg-surface-variant/60 relative m-0 flex max-w-full min-w-0 flex-wrap gap-1 rounded-xl border-0 p-1"
		>
			<m.span
				aria-hidden
				className="bg-primary shadow-primary/20 pointer-events-none absolute top-0 left-0 rounded-lg shadow-md will-change-transform"
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
						onClick={() => onChange(option.value)}
						className={cn(
							"text-on-surface-variant relative z-10 flex-1 rounded-lg bg-transparent px-3 py-2",
							"hover:text-on-surface transition-all duration-200 will-change-auto hover:bg-transparent",
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
