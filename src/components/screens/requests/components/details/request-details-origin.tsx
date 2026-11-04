"use client"

import { InboxIcon } from "lucide-react"
import type { FC } from "react"

import type { RequestsTransportHttpGetRequestResponse } from "@/api/generated"
import {
	REQUEST_ORIGIN_ICON,
	REQUEST_ORIGIN_LABEL
} from "@/libs/constants/screens/request-details"

import { RequestDetailsCopyRow } from "./request-details-copy-row"
import { RequestDetailsSection } from "./request-details-section"

interface Props {
	origin: RequestsTransportHttpGetRequestResponse["origin"]
}

const getLink = (type: string | undefined, value: string) => {
	if (type === "email")
		return { href: `mailto:${value}`, label: "Написать письмо" }

	if (type === "phone") {
		return { href: `tel:${value.replace(/[^\d+]/g, "")}`, label: "Позвонить" }
	}

	return null
}

export const RequestDetailsOrigin: FC<Props> = ({ origin }) => {
	const items = (origin ?? []).filter(item => item.value)

	if (items.length === 0) return null

	return (
		<RequestDetailsSection icon={InboxIcon} title="Источники" divided>
			{items.map(item => {
				const link = getLink(item.type, item.value ?? "")

				return (
					<RequestDetailsCopyRow
						key={`${item.type}-${item.value}`}
						icon={
							REQUEST_ORIGIN_ICON[item.type ?? "other"] ??
							REQUEST_ORIGIN_ICON.other
						}
						label={REQUEST_ORIGIN_LABEL[item.type ?? "other"]}
						value={item.value ?? ""}
						href={link?.href}
						hrefLabel={link?.label}
					/>
				)
			})}
		</RequestDetailsSection>
	)
}
