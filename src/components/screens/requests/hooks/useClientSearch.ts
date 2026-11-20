"use client"

import { useCallback, useState } from "react"

import {
	CLIENT_SEARCH_DEBOUNCE,
	CLIENT_SEARCH_LIMIT
} from "@/libs/constants/screens/requests/request-form"
import { useDebouncedValue } from "@/libs/hooks"
import { useClients } from "@/libs/query/hooks/use-clients"

/**
 * Поиск клиентов по названию: запрос уходит через CLIENT_SEARCH_DEBOUNCE мс
 * после последнего символа, а прошлый список остаётся на экране, пока грузится новый.
 */
export const useClientSearch = (enabled: boolean) => {
	const [query, setQuery] = useState("")

	const trimmed = query.trim()
	const debounced = useDebouncedValue(trimmed, CLIENT_SEARCH_DEBOUNCE)

	const { clients, total, isPending, isError, isFetching, refetch } =
		useClients({ q: debounced, limit: CLIENT_SEARCH_LIMIT }, enabled)

	const reset = useCallback(() => setQuery(""), [])

	return {
		query,
		setQuery,
		reset,
		/** Запрос, по которому реально показан список */
		searchedQuery: debounced,
		clients,
		total,
		/** Первая загрузка — показываем скелетон */
		isLoading: isPending && isFetching,
		isError: isError,
		/** Печатают или идёт запрос — список слегка приглушаем */
		isSearching: trimmed !== debounced || isFetching,
		refetch
	}
}
