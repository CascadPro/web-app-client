import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios"

import { API_URL } from "@/libs/constants"
import { parseApiError } from "@/libs/errors"
import { useAuthStore } from "@/store/auth"

import type {
	RequestsTransportHttpGetRequestsRequest as GetRequestsRequest,
	RequestsTransportHttpGetRequestsResponse as GetRequestsResponse
} from "./generated"
import { getCascadeProAppAPI } from "./generated"

interface RetryConfig extends AxiosRequestConfig {
	_retry?: boolean
}

const instance = axios.create({
	baseURL: API_URL,
	headers: {
		"Accept-Language": "ru",
		"Content-Type": "application/json"
	}
})

const service = getCascadeProAppAPI(instance)

service.getRequests = (
	request?: GetRequestsRequest,
	options?: AxiosRequestConfig
): Promise<AxiosResponse<GetRequestsResponse>> => {
	return instance.query(`/requests`, request, options)
}

let refreshPromise: Promise<string | null> | null = null

const refreshAccessToken = async (): Promise<string | null> => {
	if (refreshPromise) {
		return refreshPromise
	}

	refreshPromise = (async () => {
		try {
			const response = await fetch("/api/auth/refresh", {
				method: "GET",
				credentials: "include"
			})

			if (!response.ok) {
				return null
			}

			const data = await response.json()

			const accessToken = data.access_token

			if (!accessToken) {
				return null
			}

			useAuthStore.getState().setAccessToken(accessToken)

			return accessToken
		} catch {
			return null
		} finally {
			refreshPromise = null
		}
	})()

	return refreshPromise
}

const ROOT_ROUTER_PATHS = new Set(["sessions", "requests", "auth", "users"])

instance.interceptors.request.use(
	config => {
		const accessToken = useAuthStore.getState().accessToken

		if (accessToken) {
			config.headers.Authorization = `Bearer ${accessToken}`
		}

		if (ROOT_ROUTER_PATHS.has(config.url?.split("/").at(-1) || "")) {
			config.url += "/"
		}

		return config
	},
	error => Promise.reject(error)
)

instance.interceptors.response.use(
	response => response,

	async error => {
		const apiError = parseApiError(error)

		if (!axios.isAxiosError(error) || error.response?.status !== 401) {
			throw apiError
		}

		const originalRequest = error.config as RetryConfig

		if (!originalRequest) {
			throw apiError
		}

		if (originalRequest._retry) {
			useAuthStore.getState().setUnauthenticated()

			throw apiError
		}

		originalRequest._retry = true

		const token = await refreshAccessToken()

		if (!token) {
			useAuthStore.getState().setUnauthenticated()

			throw apiError
		}

		originalRequest.headers = {
			...originalRequest.headers,
			Authorization: `Bearer ${token}`
		}

		return instance(originalRequest)
	}
)

export { instance, service }
