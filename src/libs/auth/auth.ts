import type {
	AuthTransportHttpLoginRequest,
	AuthTransportHttpRegisterRequest
} from "@/api/generated"
import { service } from "@/api/instance"
import { useAuthStore } from "@/store/auth"

import { getContentType } from "../utils"

export type LoginRequestDTO = AuthTransportHttpLoginRequest

export type RegisterRequestDTO = AuthTransportHttpRegisterRequest

export interface RefreshAccessTokenResponse {
	access_token: string
}

export const login = async ({ email, password }: LoginRequestDTO) => {
	const request = JSON.stringify({
		email,
		password
	})

	const response = await fetch("/api/auth/login", {
		method: "POST",
		headers: getContentType("json"),
		body: request
	})

	if (!response.ok) {
		throw await response.json()
	}

	const data = (await response.json()) as RefreshAccessTokenResponse

	useAuthStore.getState().setAccessToken(data.access_token)

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
		credentials: "include"
	})

	if (!response.ok) {
		useAuthStore.getState().setUnauthenticated()
		throw new Error("Unable to refresh session")
	}

	const data = (await response.json()) as RefreshAccessTokenResponse

	useAuthStore.getState().setAccessToken(data.access_token)

	const userResponse = await service.getUsersMy()

	useAuthStore.getState().setAuthenticated(userResponse.data)

	return userResponse.data
}

export const logout = async () => {
	try {
		await fetch("/api/auth/logout", {
			method: "POST",
			credentials: "include"
		})
	} finally {
		useAuthStore.getState().reset()
	}
}
