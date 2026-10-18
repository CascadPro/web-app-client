"use client"

import { AnimatePresence, m } from "motion/react"
import type { FC } from "react"
import { memo } from "react"

import type { RequestHttpDtoGetRequestsResponseRequest } from "@/api/generated"
import type { ErrorCatchResult } from "@/libs/utils"

import { RequestCard } from "../card/request-card"

import { RequestEmpty } from "./request-empty"
import { RequestError } from "./request-error"
import { RequestLoading } from "./request-loading"

interface Props {
	requests: RequestHttpDtoGetRequestsResponseRequest[]
	isPending: boolean
	error: ErrorCatchResult | null
}

const RequestsListComponent: FC<Props> = ({ requests, isPending, error }) => {
	if (isPending) return <RequestLoading />

	if (error) return <RequestError />

	if (requests.length === 0) return <RequestEmpty />

	return (
		<m.div id="request-list" className="grid gap-(--card-gap)">
			<AnimatePresence mode="popLayout">
				{requests.map(request => (
					<RequestCard key={request.id} request={request} />
				))}
			</AnimatePresence>
		</m.div>
	)
}

export const RequestsList = memo(RequestsListComponent)
