"use client"

import type { LucideIcon } from "lucide-react"
import type { FC } from "react"

import { RequestDetailsSection } from "./request-details-section"

interface Props {
	icon: LucideIcon
	title: string
	items?: string[]
}

/** Виды работ и география — чипы, а не строка через запятую: каждый пункт виден отдельно */
export const RequestDetailsTags: FC<Props> = ({ icon, title, items }) => {
	const list = (items ?? []).filter(Boolean)

	if (list.length === 0) return null

	return (
		<RequestDetailsSection
			icon={icon}
			title={title}
			count={String(list.length)}
		>
			<ul className="flex flex-wrap gap-2 p-3">
				{list.map(item => (
					<li
						key={item}
						className="bg-primary/10 text-primary max-w-full rounded-full px-3 py-1 text-sm break-words"
					>
						{item}
					</li>
				))}
			</ul>
		</RequestDetailsSection>
	)
}
