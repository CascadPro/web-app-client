import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios"

import { API_URL } from "@/libs/constants"
import { parseApiError } from "@/libs/errors"
import { queryClient } from "@/libs/query/client"
import { queryPersister } from "@/libs/query/persister"
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

const refreshAccessToken = (): Promise<string | null> => {
	if (refreshPromise) {
		return refreshPromise
	}

	refreshPromise = (async () => {
		try {
			const response = await fetch("/api/auth/refresh", {
				method: "GET",
				credentials: "include",
				cache: "no-store"
			})

			if (!response.ok) {
				return null
			}

			const data: unknown = await response.json()

			if (
				typeof data !== "object" ||
				data === null ||
				!("access_token" in data) ||
				typeof data.access_token !== "string" ||
				data.access_token.length === 0
			) {
				return null
			}

			useAuthStore.getState().setAccessToken(data.access_token)

			return data.access_token
		} catch {
			return null
		} finally {
			refreshPromise = null
		}
	})()

	return refreshPromise
}

const clearAuthenticatedCache = (): void => {
	queryClient.clear()

	queryPersister.removeClient()
}

const expireClientSession = (): void => {
	useAuthStore.getState().setUnauthenticated()
	clearAuthenticatedCache()
}

const isAuthEndpoint = (url?: string): boolean => {
	if (!url) return false

	const pathname = url.split("?")[0].replace(/\/+$/, "")

	return /(?:^|\/)auth(?:\/|$)/i.test(pathname)
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

		const originalRequest = error.config as RetryConfig | undefined

		if (!originalRequest) {
			throw apiError
		}

		if (isAuthEndpoint(originalRequest.url)) {
			throw apiError
		}

		if (originalRequest._retry) {
			expireClientSession()
			throw apiError
		}

		originalRequest._retry = true

		const token = await refreshAccessToken()

		if (!token) {
			expireClientSession()
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
