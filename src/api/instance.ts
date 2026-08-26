import axios, { AxiosError } from "axios"

import { API_URL, CookieStorageKeys } from "@/libs/constants"
import { CookieStorage, getContentType, ms } from "@/libs/utils"

import { getCascadeProAppAPI } from "./generated"

const instance = axios.create({
	baseURL: API_URL,
	headers: getContentType("json"),
	withCredentials: true
})

const service = getCascadeProAppAPI(instance)

instance.interceptors.request.use(
	async config => {
		const appName = "Cascade Pro"
		const appVersion = "0.0.0"

		// const osInfo = `${capitalize(Platform.OS)} ${Platform.Version}`
		// const deviceModel = `${Device.brand} ${Device.modelName}`

		const osInfo = "Android 34"
		const deviceModel = "Xiaomi 11T"

		config.headers["User-Agent"] =
			`${appName}/${appVersion} (${osInfo}; ${deviceModel}; 1)`

		const storage = new CookieStorage(CookieStorageKeys.ACCESS_TOKEN)

		const [ok, accessToken] = storage.get()
		if (ok) {
			config.headers.Authorization = `Bearer ${accessToken}`
		}

		return config
	},
	error => Promise.reject(error)
)

instance.interceptors.response.use(
	response => response,
	async (error: AxiosError) => {
		if (error.response?.status === 401) {
			const RStorage = new CookieStorage(CookieStorageKeys.REFRESH_TOKEN)
			const AStorage = new CookieStorage(CookieStorageKeys.ACCESS_TOKEN)

			const [ok, refreshToken] = RStorage.get()
			if (!ok) {
				AStorage.remove()

				throw error
			}

			const response = await service.getAuthLoginRefresh({
				headers: {
					"Set-Cookie": `${CookieStorageKeys.REFRESH_TOKEN}=${refreshToken}; Max-Age=${ms("5min") / 1000}; HttpOnly; SameSite=Lax`
				}
			})

			if (!response?.data?.access_token) throw error

			AStorage.save(response.data.access_token, { expiresMs: "15min" })

			if (error.config) {
				return await instance(error.config)
			}

			throw error
		}
	}
)

export { service }
