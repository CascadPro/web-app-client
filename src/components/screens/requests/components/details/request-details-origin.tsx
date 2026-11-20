"use client"

import { InboxIcon } from "lucide-react"
import type { FC } from "react"

import type { RequestsTransportHttpGetRequestResponse } from "@/api/generated"
import { processOriginItem } from "@/libs/utils/screens/request-details"

import { RequestDetailsCopyRow } from "./request-details-copy-row"
import { RequestDetailsSection } from "./request-details-section"

interface Props {
	origin: RequestsTransportHttpGetRequestResponse["origin"]
}

export const RequestDetailsOrigin: FC<Props> = ({ origin }) => {
	const items = (origin ?? []).filter(item => item.email || item.phone || item.other)

	if (items.length === 0) return null

	return (
		<RequestDetailsSection icon={InboxIcon} title="Источники" divided>
			{items.map((item, index) => {
				const { type, link, value } = processOriginItem(item)

				return (
					<RequestDetailsCopyRow
						key={`${index}-${type}-${value}`}
						type={type}
						value={value}
						href={link?.href}
						hrefLabel={link?.label}
					/>
				)
			})}
		</RequestDetailsSection>
	)
}