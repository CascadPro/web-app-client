import axios from "axios"
import { cookies } from "next/headers"

import { API_URL, CookieStorageKeys } from "@/libs/constants"
import { getContentType } from "@/libs/utils"

import { getCascadeProAppAPI } from "./generated"

const serverInstance = axios.create({
	baseURL: API_URL,
	headers: {
		"Accept-Language": "ru",
		...getContentType("json")
	}
})

serverInstance.interceptors.request.use(async config => {
	const cookieStore = await cookies()
	const refreshToken = cookieStore.get(CookieStorageKeys.REFRESH_TOKEN)?.value

	if (refreshToken) {
		config.headers.Cookie = `${CookieStorageKeys.REFRESH_TOKEN}=${refreshToken}`
	}

	return config
})

const serverService = getCascadeProAppAPI(serverInstance)

export { serverInstance, serverService }
