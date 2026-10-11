"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import type { RequestsTransportHttpGetRequestsRequest as GetRequestsParams } from "@/api/generated"
import { service } from "@/api/instance"
import { ms } from "@/libs/utils"

import { QueryKeys } from "../keys"

export const useRequests = (params?: GetRequestsParams) => {
	if (params?.statuses) {
		params.statuses.sort()
	}

	const { data, ...other } = useQuery({
		queryKey: QueryKeys.requests.list(params),
		queryFn: async () =>
			(await service.getRequests(params, { method: "QUERY" })).data,
		staleTime: ms("5min"),
		gcTime: ms("15min"),
		placeholderData: previous => previous
	})

	return {
		requests: data?.requests ?? [],
		totalLength: data?.length ?? 0,
		...other
	}
}

export const useRequestStats = () => {
	const { data, ...other } = useQuery({
		queryKey: QueryKeys.requests.stats(),
		queryFn: async () => (await service.getRequestsStats()).data,
		staleTime: ms("5min"),
		gcTime: ms("15min"),
		placeholderData: previous => previous
	})

	return { statistics: data ?? null, ...other }
}

export const useRequestPatchStatus = (id: string) => {
	const client = useQueryClient()

	const refreshRequests = () => {
		void client.refetchQueries({ queryKey: QueryKeys.requests.all })
	}

	const approveMutation = useMutation({
		mutationFn: () => service.patchRequestsIdApprove(id),
		onSuccess: refreshRequests,
		onError: refreshRequests
	})

	const rejectMutation = useMutation({
		mutationFn: () => service.patchRequestsIdReject(id),
		onSuccess: refreshRequests
	})

	return {
		approve: approveMutation.mutateAsync,
		reject: rejectMutation.mutateAsync,
		isApproveLoading: approveMutation.isPending,
		isRejectLoading: rejectMutation.isPending
	}
}
