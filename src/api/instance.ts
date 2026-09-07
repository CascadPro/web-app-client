import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios"

import { API_URL } from "@/libs/constants"
import { getContentType } from "@/libs/utils"
import { useAuthStore } from "@/store/auth"

import { getCascadeProAppAPI } from "./generated"

type RetryConfig = InternalAxiosRequestConfig & {
	_retry?: boolean
}

const instance = axios.create({
	baseURL: API_URL,
	headers: getContentType("json"),
	withCredentials: true
})

const service = getCascadeProAppAPI(instance)

let refreshPromise: Promise<string | null> | null = null

const refreshAccessToken = async (): Promise<string | null> => {
	if (refreshPromise) {
		return refreshPromise
	}

	refreshPromise = (async () => {
		try {
			const response = await fetch("/api/refresh", {
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

instance.interceptors.request.use(
	config => {
		const accessToken = useAuthStore.getState().accessToken

		if (accessToken) {
			config.headers.Authorization = `Bearer ${accessToken}`
		}

		return config
	},
	error => Promise.reject(error)
)

instance.interceptors.response.use(
	response => response,

	async (error: AxiosError) => {
		const originalRequest = error.config as RetryConfig | undefined

		if (
			error.response?.status !== 401 ||
			!originalRequest ||
			originalRequest._retry
		) {
			throw error
		}

		originalRequest._retry = true

		const accessToken = await refreshAccessToken()

		if (!accessToken) {
			useAuthStore.getState().setUnauthenticated()

			throw error
		}

		originalRequest.headers.Authorization = `Bearer ${accessToken}`

		return instance(originalRequest)
	}
)

export { instance, service }
