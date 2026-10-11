import { AnimatePresence, m } from "motion/react"
import type { FC } from "react"

import { Separator, Skeleton } from "@/components/ui"

import { useRequestCardDetails } from "../../../hooks/useRequestCardDetails"

import { RequestCardDetailsContent } from "./request-details-content"

interface Props {
	id: string
	isCollapsed: boolean
}

export const RequestCardDetails: FC<Props> = ({ id, isCollapsed }) => {
	const { request, isPending, height } = useRequestCardDetails(id, isCollapsed)

	let content
	if (height === 0) {
		content = (
			<div className="border-outline/20 flex h-28 w-full items-center justify-center rounded-2xl border border-dashed">
				<p>Нет дополнительной информации</p>
			</div>
		)
	} else {
		content = (
			<RequestCardDetailsContent
				origin={request?.origin}
				client={request?.client}
				workType={request?.work_types}
				geoDescription={request?.geography_description}
				status={request?.status}
				statusBy={request?.status_by}
			/>
		)
	}

	return (
		<AnimatePresence>
			{!isCollapsed && (
				<m.div
					initial={{ height: "0rem" }}
					animate={{ height: `${height === 0 ? 10 : height}rem` }}
					exit={{ height: "0rem" }}
					className="overflow-hidden px-4 sm:px-5"
				>
					<Separator
						type="horizontal"
						className="bg-outline/20 mx-auto mt-3 mb-5 w-11/12"
					/>

					{isPending
						? new Array(3)
								.fill(0)
								.map((zero, i) => (
									<Skeleton key={i + zero} className="mb-3 h-8 w-full" />
								))
						: content}
				</m.div>
			)}
		</AnimatePresence>
	)
}
