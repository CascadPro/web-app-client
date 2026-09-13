import type { LucideIcon } from "lucide-react"
import type { FC } from "react"

import { Title } from "@/components/ui"

interface Props {
	Icon: LucideIcon
	title: string
}

export const SessionSectionTitle: FC<Props> = ({ Icon, title }) => {
	return (
		<div className="mb-3 flex items-center gap-2">
			<span className="text-on-surface-variant">
				<Icon size={20} />
			</span>

			<Title size="sm" className="text-on-surface">
				{title}
			</Title>
		</div>
	)
}
