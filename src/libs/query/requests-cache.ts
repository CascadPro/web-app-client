import type { QueryClient } from "@tanstack/react-query"

import type {
	RequestsTransportHttpCreateRequestResponse as CreatedRequest,
	RequestsTransportHttpGetRequestResponse as DetailResponse,
	DomainRequestStatus,
	RequestsTransportHttpGetRequestsRequest as GetRequestsParams,
	RequestsTransportHttpPatchRequestRequest as PatchBody,
	RequestsTransportHttpGetRequestsResponse as RequestsResponse,
	RequestsTransportHttpGetRequestStatsResponse as StatsResponse
} from "@/api/generated"
import type { RequestDocKey } from "@/libs/constants/screens/request-docs"
import { DEFAULT_REQUESTS_LIMIT } from "@/libs/constants/screens/requests"

import { QueryKeys } from "./keys"

/** Индекс параметров в ключе: ["requests", "list", params] */
const PARAMS_INDEX = 2

const matchesStatuses = (
	params: GetRequestsParams | undefined,
	status: DomainRequestStatus
): boolean => !params?.statuses?.length || params.statuses.includes(status)

/** Новая заявка встаёт в начало только там, где список «сначала новые» и это первая страница */
const canPrepend = (params: GetRequestsParams | undefined): boolean => {
	const sort = params?.sort

	return (!sort || sort === "newest") && (params?.page ?? 1) === 1
}

/**
 * Вносит созданную заявку в кэш без лишних запросов:
 *  - в подходящие списки — вставляет в начало (мгновенно, без мигания скелетона);
 *  - в остальные подходящие — помечает устаревшими и перезагружает;
 *  - в статистику — прибавляет счётчики.
 * Обновлённые вручную записи помечаются устаревшими без перезапроса,
 * поэтому при следующем монтировании подтянется серверная версия.
 */
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

/**
 * Вносит правки заявки в кэш сразу после сохранения: карточка и «Подробнее»
 * обновляются мгновенно, без мигания. Затем данные сверяются с сервером
 * (он пересчитывает заполненность и дату обновления).
 */
export const patchRequestInCache = (
	client: QueryClient,
	id: string,
	body: PatchBody
): void => {
	const fields = {
		...(body.title !== undefined && { title: body.title }),
		...(body.deadline !== undefined && { deadline: body.deadline }),
		...(body.origin !== undefined && { origin: body.origin }),
		...(body.work_types !== undefined && { work_types: body.work_types })
	}

	client.setQueryData<DetailResponse>(
		QueryKeys.requests.detail(id),
		previous =>
			previous
				? {
						...previous,
						...fields,
						// В ответе география называется geography_description
						...(body.geography !== undefined && {
							geography_description: body.geography
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

/**
 * После загрузки или удаления файла сервер пересчитывает заполненность заявки,
 * поэтому перезапрашиваем деталь и списки. Промис завершается, когда деталь
 * обновилась, — до этого момента строка файла показывает «в процессе» и не мигает.
 */
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

/** Убирает файл из слота сразу, не дожидаясь ответа сервера */
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
