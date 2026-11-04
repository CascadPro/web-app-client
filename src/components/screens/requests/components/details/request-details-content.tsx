"use client"

import { BriefcaseBusinessIcon, MapPinIcon } from "lucide-react"
import { m } from "motion/react"
import type { FC } from "react"

import type { RequestsTransportHttpGetRequestResponse } from "@/api/generated"
import { DURATION, EASE_OUT } from "@/libs/motion"

import { RequestDetailsClient } from "./request-details-client"
import { RequestDetailsFiles } from "./request-details-files"
import { RequestDetailsHeader } from "./request-details-header"
import { RequestDetailsMissing } from "./request-details-missing"
import { RequestDetailsOrigin } from "./request-details-origin"
import { RequestDetailsStatus } from "./request-details-status"
import { RequestDetailsTags } from "./request-details-tags"

interface Props {
	request: RequestsTransportHttpGetRequestResponse
	/** id заявки — по нему загружаются и удаляются файлы */
	requestId: string
}

export const RequestDetailsContent: FC<Props> = ({ request, requestId }) => (
	<m.div
		initial={{ opacity: 0 }}
		animate={{ opacity: 1 }}
		transition={{ duration: DURATION.base, ease: EASE_OUT }}
		className="flex flex-col gap-5 pt-2"
	>
		<RequestDetailsHeader request={request} />

		<RequestDetailsMissing fields={request.fields_remaining ?? []} />

		<RequestDetailsOrigin origin={request.origin} />

		<RequestDetailsClient client={request.client} />

		<RequestDetailsTags
			icon={BriefcaseBusinessIcon}
			title="Виды работ"
			items={request.work_types}
		/>

		<RequestDetailsTags
			icon={MapPinIcon}
			title="География"
			items={request.geography_description}
		/>

		<RequestDetailsFiles requestId={requestId} docs={request.docs} />

		<RequestDetailsStatus user={request.status_by} status={request.status} />
	</m.div>
)
