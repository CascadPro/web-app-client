"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { service } from "@/api/instance"
import { ms } from "@/libs/utils"
import {
	type ClientsParams,
	normalizeClientsParams
} from "@/libs/utils/screens/clients/normalize"

import { QueryKeys } from "../keys"

/**
 * Список клиентов с поиском по названию (параметр q).
 *
 * - прошлый результат остаётся на экране, пока грузится новый, поэтому список
 *   не превращается в скелетон на каждое изменение запроса;
 * - устаревший запрос отменяется (signal), быстрый ответ не перетирается медленным.
 * Задержку при вводе (debounce) делает вызывающий код — см. useDebouncedValue.
 */
export const useClients = (params: ClientsParams = {}, enabled = true) => {
	const normalized = normalizeClientsParams(params)

	const { data, ...other } = useQuery({
		queryKey: QueryKeys.clients.list(normalized),
		queryFn: async ({ signal }) =>
			(await service.getClients(normalized, { signal })).data,
		enabled,
		staleTime: ms("1min"),
		gcTime: ms("5min"),
		placeholderData: keepPreviousData
	})

	return {
		clients: data?.items || [],
		total: data?.length ?? data?.items?.length ?? null,
		...other
	}
}

/** Один клиент по id: для подписи уже выбранного заказчика (в форме хранится только id) */
export const useClient = (id: string | null | undefined, enabled = true) =>
	useQuery({
		queryKey: QueryKeys.clients.detail(id ?? ""),
		queryFn: async ({ signal }) =>
			(await service.getClientsId(id ?? "", { signal })).data,
		enabled: Boolean(id) && enabled,
		staleTime: ms("5min"),
		gcTime: ms("10min")
	})
