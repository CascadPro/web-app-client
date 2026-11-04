import type { FetchLike } from "@/libs/utils/screens/request-details"
import { useAuthStore } from "@/store/auth"

import { expireClientSession, refreshAccessToken } from "./instance"

/**
 * fetch с тем же способом авторизации, что и у axios-клиента: Bearer-токен
 * из хранилища, а при 401 — обновление токена и один повтор.
 * Нужен там, где требуется настоящий поток (axios в браузере его не даёт).
 */
export const authorizedFetch: FetchLike = async (input, init) => {
	const send = (token: string | null) => {
		const headers = new Headers(init?.headers)

		if (token) headers.set("Authorization", `Bearer ${token}`)

		return fetch(input, { ...init, headers, cache: "no-store" })
	}

	const response = await send(useAuthStore.getState().accessToken)

	if (response.status !== 401) return response

	const token = await refreshAccessToken()

	if (!token) {
		expireClientSession()

		return response
	}

	return send(token)
}
