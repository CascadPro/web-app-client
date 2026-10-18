import type {
	AuthTransportHttpLoginRequest,
	AuthTransportHttpRegisterRequest
} from "@/api/generated"
import { service } from "@/api/instance"
import { ApiError, type ApiErrorCode } from "@/libs/errors/api"
import { API_ERROR_MESSAGES } from "@/libs/errors/messages"
import { QueryKeys } from "@/libs/query/keys"
import { useAuthStore } from "@/store/auth"

import { queryClient } from "../query/client"
import { queryPersister } from "../query/persister"

export type LoginRequestDTO = AuthTransportHttpLoginRequest

export type RegisterRequestDTO = AuthTransportHttpRegisterRequest

export interface RefreshAccessTokenResponse {
	access_token: string
}

const throwResponseError = async (response: Response): Promise<never> => {
	const payload: unknown = await response.json().catch(() => null)

	const data =
		typeof payload === "object" && payload !== null
			? (payload as Record<string, unknown>)
			: {}

	const rawCode = data.code

	const code: ApiErrorCode =
		typeof rawCode === "string" && rawCode in API_ERROR_MESSAGES
			? (rawCode as ApiErrorCode)
			: response.status === 401
				? "unauthorized"
				: response.status === 429
					? "too_many_requests"
					: "internal_error"

	const fields =
		typeof data.fields === "object" &&
		data.fields !== null &&
		!Array.isArray(data.fields)
			? Object.fromEntries(
					Object.entries(data.fields).filter(
						(entry): entry is [string, string] => typeof entry[1] === "string"
					)
				)
			: {}

	throw new ApiError({
		code,
		status: response.status,
		message:
			typeof data.message === "string"
				? data.message
				: API_ERROR_MESSAGES[code],
		fields
	})
}

export const login = async ({ email, password }: LoginRequestDTO) => {
	const request = JSON.stringify({
		email,
		password
	})

	const response = await fetch("/api/auth/login", {
		method: "POST",
		credentials: "include",
		cache: "no-store",
		headers: { "Content-Type": "application/json" },
		body: request
	})

	if (!response.ok) {
		await throwResponseError(response)
	}

	const data = (await response.json()) as RefreshAccessTokenResponse

	useAuthStore.getState().setAccessToken(data.access_token)
	useAuthStore.getState().setAuthenticated()

	void queryClient.invalidateQueries({
		queryKey: QueryKeys.users.me()
	})

	return data
}

export const register = async ({
	email,
	password,
	token
}: RegisterRequestDTO) => {
	await service.postAuthRegister({
		email,
		password,
		token
	})

	return login({ email, password })
}

export const refreshSession = async () => {
	const response = await fetch("/api/auth/refresh", {
		method: "GET",
		credentials: "include",
		cache: "no-store"
	})

	if (!response.ok) {
		useAuthStore.getState().setUnauthenticated()

		throw new Error("Unable to refresh session")
	}

	const data = (await response.json()) as RefreshAccessTokenResponse

	useAuthStore.getState().setAccessToken(data.access_token)
	useAuthStore.getState().setAuthenticated()

	return data
}

export const logout = async () => {
	try {
		await fetch("/api/auth/logout", {
			method: "POST",
			credentials: "include"
		})
	} finally {
		useAuthStore.getState().reset()

		void queryClient.cancelQueries()

		queryClient.clear()

		await queryPersister.removeClient()
	}
}
