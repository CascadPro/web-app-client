"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react"

import type { RequestsTransportHttpGetRequestsRequest as GetRequestsParams } from "@/api/generated";
import { service } from "@/api/instance"
import { ms } from "@/libs/utils"

import { QueryKeys } from "../keys"

const EMPTY_REQUESTS: NonNullable<
	Awaited<ReturnType<typeof service.getRequests>>["data"]["requests"]
> = []

export const useRequests = (params?: GetRequestsParams) => {
	const normalizedParams = useMemo(
		() =>
			params
				? {
						...params,
						statuses: params.statuses ? [...params.statuses].sort() : undefined
					}
				: undefined,
		[params]
	)

	const { data, ...other } = useQuery({
		queryKey: QueryKeys.requests.list(normalizedParams),
		queryFn: async () => (await service.getRequests(normalizedParams)).data,
		staleTime: ms("5min"),
		gcTime: ms("15min"),
		placeholderData: previous => previous
	})

	return {
		requests: data?.requests ?? EMPTY_REQUESTS,
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

export const useRequestDetail = (id: string, enabled = true) => {
	const { data, ...other } = useQuery({
		queryKey: QueryKeys.requests.detail(id),
		queryFn: async () => (await service.getRequestsId(id)).data,
		enabled: Boolean(id) && enabled,
		staleTime: ms("3min"),
		gcTime: ms("10min")
	})

	return { request: data ?? null, ...other }
}

export const useRequestPatchStatus = (id: string) => {
	const client = useQueryClient()

	const refreshRequests = useCallback(() => {
		void client.invalidateQueries({
			queryKey: QueryKeys.requests.all
		})
	}, [client])

	const approveMutation = useMutation({
		mutationFn: () => service.patchRequestsIdApprove(id),
		onSuccess: refreshRequests,
		onError: refreshRequests
	})

	const rejectMutation = useMutation({
		mutationFn: () => service.patchRequestsIdReject(id),
		onSuccess: refreshRequests,
		onError: refreshRequests
	})

	return {
		approve: approveMutation.mutateAsync,
		reject: rejectMutation.mutateAsync,
		isApproveLoading: approveMutation.isPending,
		isRejectLoading: rejectMutation.isPending
	}
}
