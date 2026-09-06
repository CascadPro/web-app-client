import axios, { AxiosError, InternalAxiosRequestConfig } from "axios"

import { API_URL, CookieStorageKeys } from "@/libs/constants"
import { CookieStorage, getContentType } from "@/libs/utils"

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

/**
 * Promise текущего refresh-запроса.
 *
 * Если несколько запросов одновременно получат 401,
 * они будут ждать один и тот же refresh.
 */
let refreshPromise: Promise<string | null> | null = null

const getAccessToken = () => {
	const storage = new CookieStorage(CookieStorageKeys.ACCESS_TOKEN)

	const [ok, token] = storage.get()

	return ok ? token : null
}

const getRefreshToken = () => {
	const storage = new CookieStorage(CookieStorageKeys.REFRESH_TOKEN)

	const [ok, token] = storage.get()

	return ok ? token : null
}

const saveAccessToken = (token: string) => {
	const storage = new CookieStorage(CookieStorageKeys.ACCESS_TOKEN)

	storage.save(token, { expiresMs: "15min" })
}

const clearAuthStorage = () => {
	new CookieStorage(CookieStorageKeys.ACCESS_TOKEN).remove()
	new CookieStorage(CookieStorageKeys.REFRESH_TOKEN).remove()
}

/**
 * Выполняет refresh только один раз.
 */
const refreshAccessToken = async (): Promise<string | null> => {
	if (refreshPromise) {
		return refreshPromise
	}

	refreshPromise = (async () => {
		try {
			const refreshToken = getRefreshToken()

			if (!refreshToken) {
				return null
			}

			new CookieStorage(CookieStorageKeys.REFRESH_TOKEN).save(refreshToken, {
				expiresMs: "30d"
			})

			const response = await service.getAuthLoginRefresh()

			const accessToken = response.data?.access_token

			if (!accessToken) {
				return null
			}

			saveAccessToken(accessToken)

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
	async config => {
		const accessToken = getAccessToken()

		if (accessToken) {
			config.headers.Authorization = `Bearer ${accessToken}`
		}

		/**
		 * User-Agent браузер сам контролирует.
		 *
		 * Не пытаемся подменять его:
		 * браузеры запрещают изменение User-Agent через fetch/XHR.
		 */

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

		/**
		 * Не пытаемся refresh-ить сам refresh endpoint.
		 */
		if (originalRequest.url?.includes("/auth/login/refresh")) {
			clearAuthStorage()

			throw error
		}

		originalRequest._retry = true

		const accessToken = await refreshAccessToken()

		if (!accessToken) {
			clearAuthStorage()

			throw error
		}

		originalRequest.headers.Authorization = `Bearer ${accessToken}`

		return instance(originalRequest)
	}
)

export { instance, service }
