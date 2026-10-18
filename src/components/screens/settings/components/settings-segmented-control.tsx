import { Button } from "@/components/ui"
import { cn } from "@/libs/utils"
import { SettingsOption } from "@/types/screens/settings"

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
}: SettingsSegmentedControlProps<T>) => (
	<fieldset
		role="group"
		aria-label={label}
		className="bg-surface-variant/60 flex max-w-full flex-wrap gap-1 rounded-xl p-1"
	>
		{options.map(option => {
			const active = value === option.value

			return (
				<Button
					key={option.value}
					variant="ghost"
					aria-pressed={active}
					onClick={() => onChange(option.value)}
					className={cn(
						"flex-1 rounded-lg px-3 py-2",
						"text-on-surface-variant hover:text-on-surface duration-300 active:scale-90",
						"focus-visible:ring-primary focus-visible:ring-2",
						{
							"bg-primary text-on-primary shadow-sm": active
						}
					)}
				>
					{option.label}
				</Button>
			)
		})}
	</fieldset>
)
