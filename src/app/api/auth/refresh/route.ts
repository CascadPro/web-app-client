import axios from "axios"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import { serverService } from "@/api/server-instance"
import { CookieStorageKeys } from "@/libs/constants"
import { parseServerError } from "@/libs/errors"
import { isDev } from "@/libs/utils"

export async function GET() {
	const cookieStore = await cookies()

	const refreshToken = cookieStore.get(CookieStorageKeys.REFRESH_TOKEN)?.value

	if (!refreshToken) {
		return NextResponse.json(
			{ message: "Refresh token is missing" },
			{ status: 401 }
		)
	}

	try {
		const response = await serverService.getAuthLoginRefresh()

		const { access_token } = response.data

		if (!access_token) {
			throw new Error("Access token is missing")
		}

		const nextResponse = NextResponse.json({ access_token })

		nextResponse.headers.set("Cache-Control", "no-store, private")

		return nextResponse
	} catch (error) {
		const parsed = parseServerError(error)
		const status = axios.isAxiosError(error)
			? (error.response?.status ?? 500)
			: 500

		if (isDev()) {
			console.error(parsed)
		}

		const nextResponse = NextResponse.json(
			{ message: parsed.message ?? "Ошибка обновления ключа" },
			{ status }
		)

		if (status < 500 && status != 429) {
			nextResponse.cookies.delete(CookieStorageKeys.REFRESH_TOKEN)
		}

		nextResponse.headers.set("Cache-Control", "no-store, private")

		return nextResponse
	}
}
