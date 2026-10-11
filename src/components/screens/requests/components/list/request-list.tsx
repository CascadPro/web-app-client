"use client"

import { AnimatePresence, m } from "motion/react"
import type { FC } from "react"

import type { RequestHttpDtoGetRequestsResponseRequest } from "@/api/generated"

import { RequestCard } from "../card/request-card"

import { RequestEmpty } from "./request-empty"
import { RequestError } from "./request-error"
import { RequestLoading } from "./request-loading"

interface Props {
	requests: RequestHttpDtoGetRequestsResponseRequest[]
	isPending: boolean
}

export const RequestsList: FC<Props> = ({ requests, isPending }) => {
	if (isPending) {
		return <RequestLoading />
	}

	if (false) {
		return <RequestError />
	}

	if (!requests.length) {
		return <RequestEmpty />
	}

	return (
		<m.div layout id="request-list" className="grid gap-5">
			<AnimatePresence mode="popLayout">
				{requests.map(request => (
					<RequestCard key={request.id} request={request} />
				))}
			</AnimatePresence>
		</m.div>
	)
}
