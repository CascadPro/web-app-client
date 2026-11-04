"use client"

import { CircleAlertIcon } from "lucide-react"
import type { FC } from "react"

import { REQUEST_FIELD_LABELS } from "@/libs/constants/screens/request-details"

interface Props {
	fields: string[]
}

export const RequestDetailsMissing: FC<Props> = ({ fields }) => {
	if (fields.length === 0) return null

	return (
		<div className="bg-warning/10 rounded-2xl p-3">
			<p className="text-warning flex items-center gap-2 text-sm font-medium">
				<CircleAlertIcon size={18} aria-hidden />
				Осталось заполнить
			</p>

			<ul className="mt-2 flex flex-wrap gap-1.5">
				{fields.map(field => (
					<li
						key={field}
						className="bg-warning/15 text-on-surface rounded-full px-2.5 py-1 text-xs"
					>
						{REQUEST_FIELD_LABELS[field] ?? field}
					</li>
				))}
			</ul>
		</div>
	)
}
