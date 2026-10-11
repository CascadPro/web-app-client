"use client"

import { RefreshControl } from "@/components/providers/refresh-control"
import { QueryKeys } from "@/libs/query/keys"

import { RequestFilters } from "./components/filters/request-filters"
import { RequestsList } from "./components/list/request-list"
import { useRequestsScreen } from "./hooks/useRequestsScreen"

export const RequestsScreen = () => {
	const { requests, isLoading, isPending } = useRequestsScreen()

	return (
		<RefreshControl queryKey={QueryKeys.requests.all as any}>
			<div className="mx-auto w-full max-w-3xl space-y-6 px-1 sm:px-6">
				<RequestFilters isLoading={isLoading} />
				<RequestsList requests={requests} isPending={isPending} />
			</div>
		</RefreshControl>
	)
}
