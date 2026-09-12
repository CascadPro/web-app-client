import { m } from "motion/react"
import type { FC } from "react"

interface Props {
	text: string
}

export const SessionEmpty: FC<Props> = ({ text }) => {
	return (
		<m.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="border-outline/20 rounded-2xl border border-dashed p-8 text-center"
		>
			<p className="text-on-surface-variant text-sm">{text}</p>
		</m.div>
	)
}
