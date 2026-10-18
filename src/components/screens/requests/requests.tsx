"use client"

import { RefreshControl } from "@/components/providers/refresh-control"
import { QueryKeys } from "@/libs/query/keys"

import { RequestFilters } from "./components/filters/request-filters"
import { RequestsList } from "./components/list/request-list"
import { RequestCreateButton } from "./components/request-create-btn"
import { RequestsStats } from "./components/request-stats"
import { useRequestsScreen } from "./hooks/useRequestsScreen"

export const RequestsScreen = () => {
	const { requests, error, isLoading, isPending } = useRequestsScreen()

	return (
		<RefreshControl queryKey={QueryKeys.requests.all as any}>
			<div className="mx-auto w-full max-w-3xl space-y-(--section-gap) px-1 sm:px-6">
				<RequestsStats />

				<RequestFilters isLoading={isLoading} />

				<RequestsList requests={requests} isPending={isPending} error={error} />

				<RequestCreateButton />
			</div>
		</RefreshControl>
	)
}
