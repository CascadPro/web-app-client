import type { LucideIcon } from "lucide-react"

import { Title } from "@/components/ui"
import { cn } from "@/libs/utils"

interface SettingsRowProps {
	title: string
	description?: string
	icon?: LucideIcon
	trailing: React.ReactNode
	last?: boolean
	className?: string
}

export const SettingsRow = ({
	title,
	description,
	icon: Icon,
	trailing,
	last = false,
	className
}: SettingsRowProps) => (
	<div
		className={cn(
			"min-w-0 px-4 py-(--row-padding-y)",
			!last && "border-outline/15 border-b",
			className
		)}
	>
		<div className="mb-3 flex items-center gap-3">
			{Icon && (
				<Icon
					aria-hidden="true"
					size={20}
					className="text-on-surface-variant shrink-0"
				/>
			)}

			<div className="min-w-0 flex-1">
				<Title size="md" className="text-on-surface text-base">
					{title}
				</Title>

				{description && (
					<p className="text-on-surface-variant text-xs">{description}</p>
				)}
			</div>
		</div>

		<div>{trailing}</div>
	</div>
)
