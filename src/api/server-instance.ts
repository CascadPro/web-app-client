import axios from "axios"
import { cookies, headers } from "next/headers"

import { API_URL, CookieStorageKeys } from "@/libs/constants"
import { isDev } from "@/libs/utils"

import { getCascadeProAppAPI } from "./generated"

const serverInstance = axios.create({
	baseURL: API_URL,
	headers: {
		"Accept-Language": "ru",
		"Content-Type": "application/json"
	}
})

serverInstance.interceptors.request.use(async config => {
	const [cookieStore, requestHeaders] = await Promise.all([
		cookies(),
		headers()
	])

	const refreshToken = cookieStore.get(CookieStorageKeys.REFRESH_TOKEN)?.value

	if (refreshToken) {
		config.headers.Cookie = `${CookieStorageKeys.REFRESH_TOKEN}=${refreshToken}`
	}

	const realIP = requestHeaders.get("x-real-ip")

	if (realIP) {
		config.headers.set("X-Real-IP", realIP)
	}
	if (isDev()) {
		config.headers.set("X-Real-IP", "109.207.190.162")
	}

	return config
})

const serverService = getCascadeProAppAPI(serverInstance)

export { serverInstance, serverService }
