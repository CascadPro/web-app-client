"use client"

import { PaperclipIcon } from "lucide-react"
import type { FC } from "react"

import type { RequestHttpDtoGetRequestResponseDocs } from "@/api/generated"
import { REQUEST_DOC_SLOTS } from "@/libs/constants/screens/request-docs"

import { RequestDetailsFileRow } from "./request-details-file-row"
import { RequestDetailsSection } from "./request-details-section"

interface Props {
	requestId: string
	docs: RequestHttpDtoGetRequestResponseDocs | undefined
}

/** Все четыре слота всегда на виду: сразу понятно, что приложено, а чего не хватает */
export const RequestDetailsFiles: FC<Props> = ({ requestId, docs }) => {
	const attached = REQUEST_DOC_SLOTS.filter(
		({ key }) => docs?.[key]?.id || docs?.[key]?.filename
	).length

	return (
		<RequestDetailsSection
			icon={PaperclipIcon}
			title="Документы"
			count={`${attached}/${REQUEST_DOC_SLOTS.length}`}
			divided
		>
			{REQUEST_DOC_SLOTS.map(slot => (
				<RequestDetailsFileRow
					key={slot.key}
					requestId={requestId}
					slot={slot}
					file={docs?.[slot.key]}
				/>
			))}
		</RequestDetailsSection>
	)
}
