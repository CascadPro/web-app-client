import type { QueryClient } from "@tanstack/react-query"

import type {
	RequestsTransportHttpCreateRequestResponse as CreatedRequest,
	RequestsTransportHttpGetRequestResponse as DetailResponse,
	DomainRequestStatus,
	RequestsTransportHttpGetRequestsRequest as GetRequestsParams,
	RequestsTransportHttpPatchRequestRequest as PatchBody,
	RequestsTransportHttpGetRequestsResponse as RequestsResponse,
	RequestsTransportHttpGetRequestStatsResponse as StatsResponse,
	RequestHttpDtoGetRequestsResponseOrigin
} from "@/api/generated"
import { DEFAULT_REQUESTS_LIMIT } from "@/libs/constants/screens/requests"
import type { RequestDocKey } from "@/libs/constants/screens/requests/request-docs"

import { QueryKeys } from "./keys"

const PARAMS_INDEX = 2

const matchesStatuses = (
	params: GetRequestsParams | undefined,
	status: DomainRequestStatus
): boolean => !params?.statuses?.length || params.statuses.includes(status)

const canPrepend = (params: GetRequestsParams | undefined): boolean => {
	const sort = params?.sort

	return (!sort || sort === "newest") && (params?.page ?? 1) === 1
}

export const addRequestToCache = (
	client: QueryClient,
	created: CreatedRequest
): void => {
	const status: DomainRequestStatus = created.status || "default"

	const lists = client.getQueriesData<RequestsResponse>({
		queryKey: QueryKeys.requests.lists()
	})

	for (const [key, data] of lists) {
		const params = key[PARAMS_INDEX] as GetRequestsParams | undefined

		if (!matchesStatuses(params, status)) continue

		if (!data || !canPrepend(params)) {
			void client.invalidateQueries({ queryKey: key, exact: true })
			continue
		}

		const current = data.requests ?? []

		if (current.some(item => item.id === created.id)) continue

		const limit = params?.limit ?? DEFAULT_REQUESTS_LIMIT

		client.setQueryData<RequestsResponse>(key, {
			...data,
			length: (data.length ?? current.length) + 1,
			requests: [created, ...current].slice(0, limit)
		})

		void client.invalidateQueries({
			queryKey: key,
			exact: true,
			refetchType: "none"
		})
	}

	client.setQueryData<StatsResponse>(QueryKeys.requests.stats(), previous =>
		previous
			? {
					...previous,
					total: (previous.total ?? 0) + 1,
					by_status: {
						...previous.by_status,
						[status]: (previous.by_status?.[status] ?? 0) + 1
					}
				}
			: previous
	)

	void client.invalidateQueries({
		queryKey: QueryKeys.requests.stats(),
		exact: true,
		refetchType: "none"
	})
}

export const patchRequestInCache = (
	client: QueryClient,
	id: string,
	body: PatchBody
): void => {
	const title = body.title as string | undefined
	const deadline = body.deadline as string | undefined
	const geography = body.geography as string[] | undefined
	const workTypes = body.work_types as string[] | undefined
	const origin = body.origin as RequestHttpDtoGetRequestsResponseOrigin[] | undefined

	const fields = {
		...(title !== undefined && { title }),
		...(deadline !== undefined && { deadline }),
		...(origin !== undefined && { origin }),
		...(workTypes !== undefined && { work_types: workTypes })
	}

	client.setQueryData<DetailResponse>(
		QueryKeys.requests.detail(id),
		previous =>
			previous
				? {
						...previous,
						...fields,
						...(geography !== undefined && {
							geography_description: geography
						})
					}
				: previous
	)

	const lists = client.getQueriesData<RequestsResponse>({
		queryKey: QueryKeys.requests.lists()
	})

	for (const [key, data] of lists) {
		if (!data?.requests?.some(item => item.id === id)) continue

		client.setQueryData<RequestsResponse>(key, {
			...data,
			requests: data.requests.map(item =>
				item.id === id ? { ...item, ...fields } : item
			)
		})
	}

	void client.invalidateQueries({ queryKey: QueryKeys.requests.lists() })
	void client.invalidateQueries({
		queryKey: QueryKeys.requests.detail(id),
		exact: true
	})
}

export const refreshRequestFiles = async (
	client: QueryClient,
	id: string
): Promise<void> => {
	void client.invalidateQueries({ queryKey: QueryKeys.requests.lists() })

	await client.invalidateQueries({
		queryKey: QueryKeys.requests.detail(id),
		exact: true
	})
}

export const removeRequestDocFromCache = (
	client: QueryClient,
	id: string,
	key: RequestDocKey
): void => {
	client.setQueryData<DetailResponse>(
		QueryKeys.requests.detail(id),
		previous =>
			previous?.docs
				? { ...previous, docs: { ...previous.docs, [key]: undefined } }
				: previous
	)
}