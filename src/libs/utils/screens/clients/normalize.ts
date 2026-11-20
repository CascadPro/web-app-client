import type { ClientTransportHttpGetClientResponse, ClientTransportHttpClientContactResponse } from "@/api/generated"

export type ClientListItem = ClientTransportHttpGetClientResponse
export type ClientContact = ClientTransportHttpClientContactResponse

const isClient = (value: unknown): value is ClientListItem =>
	typeof value === "object" && value !== null

/**
 * Ответ списка клиентов → массив. Контракт эндпоинта пока не зафиксирован,
 * поэтому понимаем и голый массив, и объект вида { clients: [...] } (как у /requests).
 * Когда бэкенд определится — достаточно поправить эту функцию.
 */
export const normalizeClientsResponse = (data: unknown): ClientListItem[] => {
	const list = Array.isArray(data)
		? data
		: typeof data === "object" && data !== null && "clients" in data
			? data.clients
			: []

	return Array.isArray(list) ? list.filter(isClient) : []
}

/** Строка контактов для списка: «+7 (900) 000-00-00, mail@co.ru и ещё 2» */
export const formatClientContacts = (
	contacts: ClientContact[] | undefined,
	visible = 2
): string => {
	const list = (contacts ?? [])
		.map(c => c.email || c.phone)
		.filter(Boolean)

	if (list.length === 0) return ""

	const shown = list.slice(0, visible).join(", ")
	const rest = list.length - visible

	return rest > 0 ? `${shown} и ещё ${rest}` : shown
}

export interface ClientsParams {
	/** Поиск по названию клиента */
	q?: string
	page?: number
	limit?: number
}

/** Пустые значения в запрос и ключ кэша не попадают: «q=» и отсутствие q — один и тот же запрос */
export const normalizeClientsParams = (
	params: ClientsParams = {}
): ClientsParams => {
	const q = params.q?.trim()

	return {
		...(q ? { q } : {}),
		...(params.page ? { page: params.page } : {}),
		...(params.limit ? { limit: params.limit } : {})
	}
}

export const getClientTitle = (
	client?: { company?: string | null } | null
): string => client?.company?.trim() || "Без названия"
