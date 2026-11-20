"use client"

import { BuildingIcon, UserIcon } from "lucide-react"
import type { FC } from "react"

import type { RequestsTransportHttpGetRequestResponse } from "@/api/generated"

import { RequestDetailsCopyRow } from "./request-details-copy-row"
import { RequestDetailsSection } from "./request-details-section"

interface Props {
	client: RequestsTransportHttpGetRequestResponse["client"]
}

export const RequestDetailsClient: FC<Props> = ({ client }) => {
	const contacts = (client?.contacts ?? []).filter(Boolean)

	if (!client?.company && contacts.length === 0) return null

	return (
		<RequestDetailsSection icon={BuildingIcon} title="Заказчик" divided>
			{client?.company && (
				<div className="flex min-h-12 items-center gap-3 px-(--mini-row-padding-x) py-(--mini-row-padding-y)">
					<span className="bg-primary/10 text-primary grid size-8 shrink-0 place-items-center rounded-lg">
						<BuildingIcon size={16} aria-hidden />
					</span>

					<span className="min-w-0 text-sm font-medium wrap-break-word">
						{client.company}
					</span>
				</div>
			)}

			{contacts.map((contact, index) => {
				const value = contact.email ?? contact.phone ?? ""
				if (!value) return null
				const type = contact.email ? "email" : "phone"
				return (
					<RequestDetailsCopyRow
						key={`${index}-${value}`}
						type={type}
						value={value}
					/>
				)
			})}
		</RequestDetailsSection>
	)
}