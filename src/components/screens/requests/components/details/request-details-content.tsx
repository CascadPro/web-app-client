"use client"

import { BriefcaseBusinessIcon, MapPinIcon } from "lucide-react"
import { m } from "motion/react"
import type { FC } from "react"

import type { RequestsTransportHttpGetRequestResponse } from "@/api/generated"
import { DURATION, EASE_OUT, INSTANT, useReduceMotion } from "@/libs/motion"

import { RequestDetailsFiles } from "./file/request-details-files"
import { RequestDetailsClient } from "./request-details-client"
import { RequestDetailsHeader } from "./request-details-header"
import { RequestDetailsMissing } from "./request-details-missing"
import { RequestDetailsOrigin } from "./request-details-origin"
import { RequestDetailsStatus } from "./request-details-status"
import { RequestDetailsTags } from "./request-details-tags"

interface Props {
	request: RequestsTransportHttpGetRequestResponse
	requestId: string
}

export const RequestDetailsContent: FC<Props> = ({ request, requestId }) => {
	const reduceMotion = useReduceMotion()

	return (
		<m.div
			initial={reduceMotion ? false : { opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={reduceMotion ? INSTANT : { duration: DURATION.base, ease: EASE_OUT }}
			className="flex flex-col gap-(--section-gap) pt-4"
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
}
