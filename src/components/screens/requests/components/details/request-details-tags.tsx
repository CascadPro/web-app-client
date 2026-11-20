"use client"

import type { LucideIcon } from "lucide-react"
import type { FC } from "react"

import { RequestDetailsSection } from "./request-details-section"

interface Props {
	icon: LucideIcon
	title: string
	items?: string[]
}

export const RequestDetailsTags: FC<Props> = ({ icon, title, items }) => {
	const list = (items ?? []).filter(Boolean)

	if (list.length === 0) return null

	return (
		<RequestDetailsSection
			icon={icon}
			title={title}
			count={String(list.length)}
		>
			<ul className="flex flex-wrap gap-2 p-(--row-padding-y)">
				{list.map(item => (
					<li
						key={item}
						className="bg-primary/10 text-primary max-w-full rounded-full px-3 py-1 text-sm wrap-break-word"
					>
						{item}
					</li>
				))}
			</ul>
		</RequestDetailsSection>
	)
}
