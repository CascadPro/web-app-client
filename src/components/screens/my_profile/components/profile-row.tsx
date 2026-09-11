import type { FC, ReactNode } from "react"

interface Props {
	icon: ReactNode
	label: string
	value: string
}

export const ProfileRow: FC<Props> = ({ icon, label, value }) => {
	return (
		<div className="flex items-center gap-4 px-3 py-3 sm:px-5">
			<div className="bg-surface-variant/30 text-on-surface-variant flex size-9 shrink-0 items-center justify-center rounded-xl">
				{icon}
			</div>

			<div className="min-w-0 flex-1">
				<p className="text-on-surface-variant text-xs">{label}</p>

				<p className="text-on-surface mt-0.5 truncate text-sm font-medium">
					{value}
				</p>
			</div>
		</div>
	)
}
