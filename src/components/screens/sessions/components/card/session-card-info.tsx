import type { LucideIcon } from "lucide-react"
import type { FC } from "react"

interface Props {
	Icon: LucideIcon
	value: string
}

export const SessionCardInfo: FC<Props> = ({ Icon, value }) => {
	if (!value) return null

	return (
		<div className="border-outline/40 flex min-w-0 items-center gap-2 border-b pb-3">
			<span className="bg-primary/20 text-primary rounded-xl p-2">
				<Icon size={24} />
			</span>

			<span className="truncate text-base">{value}</span>
		</div>
	)
}
