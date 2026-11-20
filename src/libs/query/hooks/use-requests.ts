"use client"

import {
	type QueryClient,
	useIsMutating,
	useMutation,
	useQuery,
	useQueryClient
} from "@tanstack/react-query"
import type { AxiosProgressEvent } from "axios"
import { useCallback, useMemo } from "react"

import type {
	RequestsTransportHttpGetRequestsRequest as GetRequestsParams,
	RequestsTransportHttpPatchRequestRequest as PatchRequestBody,
	RequestHttpDtoCreateRequestRequest
} from "@/api/generated"
import { service } from "@/api/instance"
import type { RequestDocKey } from "@/libs/constants/screens/requests/request-docs"
import { ms } from "@/libs/utils"
import { uploadDocument, type UploadProgressEvent } from "@/libs/upload"

import { idempotencyHeaders } from "../idempotency"
import { QueryKeys } from "../keys"
import {
	addRequestToCache,
	patchRequestInCache,
	refreshRequestFiles,
	removeRequestDocFromCache
} from "../requests-cache"

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

const requestDetailQuery = (id: string) => ({
	queryKey: QueryKeys.requests.detail(id),
	queryFn: async () => (await service.getRequestsId(id)).data,
	staleTime: ms("3min"),
	gcTime: ms("10min")
})

export const useRequestDetail = (id: string, enabled = true) => {
	const { data, ...other } = useQuery({
		...requestDetailQuery(id),
		enabled: Boolean(id) && enabled
	})

	return { request: data ?? null, ...other }
}

export const prefetchRequestDetail = (client: QueryClient, id: string) =>
	id ? client.query(requestDetailQuery(id)) : Promise.resolve()

export const useRequestPatchStatus = (id: string) => {
	const client = useQueryClient()

	const refreshRequests = useCallback(() => {
		void client.invalidateQueries({
			queryKey: QueryKeys.requests.all
		})
	}, [client])

	const patchMutation = useMutation({
		mutationFn: (status: "approve" | "reject") => {
			if (status === "approve") {
				return service.patchRequestsIdApprove(id)
			}
			return service.patchRequestsIdReject(id)
		},
		onSuccess: refreshRequests,
		onError: refreshRequests
	})

	return {
		patchStatus: patchMutation.mutateAsync,
		isPending: patchMutation.isPending,
		pendingStatus: patchMutation.isPending
			? (patchMutation.variables ?? null)
			: null
	}
}

export interface CreateRequestVariables {
	body: RequestHttpDtoCreateRequestRequest
	idempotencyKey: string
}

export const useCreateRequest = () => {
	const client = useQueryClient()

	return useMutation({
		mutationKey: QueryKeys.requests.create(),
		mutationFn: async ({ body, idempotencyKey }: CreateRequestVariables) =>
			(
				await service.postRequests(body, {
					headers: idempotencyHeaders(idempotencyKey)
				})
			).data,
		onSuccess: created => addRequestToCache(client, created)
	})
}

export const useUpdateRequest = (id: string) => {
	const client = useQueryClient()

	return useMutation({
		mutationKey: QueryKeys.requests.update(id),
		mutationFn: async (body: PatchRequestBody) => {
			await service.patchRequestsId(id, body)

			return body
		},
		onSuccess: body => patchRequestInCache(client, id, body)
	})
}

export interface UploadRequestFileVariables {
	file: File
	idempotencyKey: string
	onProgress?: (percent: number) => void
}

export const useUploadRequestFile = (id: string, index: number) => {
	const client = useQueryClient()

	return useMutation({
		mutationKey: QueryKeys.requests.fileUpload(id, index),
		mutationFn: async ({
			file,
			idempotencyKey,
			onProgress
		}: UploadRequestFileVariables) => {
			const result = await uploadDocument({
				file,
				url: `/requests/${id}/file/${index}`,
				headers: idempotencyHeaders(idempotencyKey),
				onProgress: (event: UploadProgressEvent) => {
					onProgress?.(event.percent)
				},
			})
			if (!result.success) {
				throw result.error ?? new Error(`Upload failed: ${result.status} ${result.statusText}`)
			}
		},
		onSuccess: () => refreshRequestFiles(client, id)
	})
}

export interface DeleteRequestFileVariables {
	idempotencyKey: string
	docKey: RequestDocKey
}

export const useDeleteRequestFile = (id: string, index: number) => {
	const client = useQueryClient()

	return useMutation({
		mutationKey: QueryKeys.requests.fileDelete(id, index),
		mutationFn: async ({ idempotencyKey }: DeleteRequestFileVariables) =>
			await service.deleteRequestsIdFileIndex(id, index, {
				headers: idempotencyHeaders(idempotencyKey)
			}),
		onSuccess: (_, { docKey }) => {
			removeRequestDocFromCache(client, id, docKey)

			return refreshRequestFiles(client, id)
		}
	})
}

export const useRequestFileBusy = (id: string, index: number) => {
	const uploading = useIsMutating({
		mutationKey: QueryKeys.requests.fileUpload(id, index)
	})
	const deleting = useIsMutating({
		mutationKey: QueryKeys.requests.fileDelete(id, index)
	})

	return { isUploading: uploading > 0, isDeleting: deleting > 0 }
}
