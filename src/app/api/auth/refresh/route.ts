import axios from "axios"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import { serverService } from "@/api/server-instance"
import { CookieStorageKeys } from "@/libs/constants"
import { parseServerError } from "@/libs/errors"
import { isDev } from "@/libs/utils"

const noStore = (response: NextResponse): NextResponse => {
	response.headers.set("Cache-Control", "no-store, private")
	return response
}

const unauthorizedResponse = (): NextResponse => {
	const response = NextResponse.json(
		{
			code: "unauthorized",
			message: "Сессия истекла. Войдите в аккаунт повторно."
		},
		{ status: 401 }
	)

	response.cookies.delete(CookieStorageKeys.REFRESH_TOKEN)

	return noStore(response)
}

export async function GET() {
	const cookieStore = await cookies()
	const refreshToken = cookieStore.get(CookieStorageKeys.REFRESH_TOKEN)?.value

	if (!refreshToken) {
		return unauthorizedResponse()
	}

	try {
		const response = await serverService.getAuthLoginRefresh()
		const accessToken = response.data.access_token

		if (!accessToken) {
			throw new Error("Access token is missing")
		}

		return noStore(NextResponse.json({ access_token: accessToken }))
	} catch (error) {
		const parsed = parseServerError(error)
		const status = axios.isAxiosError(error)
			? (error.response?.status ?? 500)
			: 500

		if (isDev()) {
			console.error(parsed)
		}

		const response = NextResponse.json(
			{
				code: parsed.code ?? "internal_error",
				message: parsed.message ?? "Не удалось обновить сессию"
			},
			{ status }
		)

		if (status < 500 && status !== 429) {
			response.cookies.delete(CookieStorageKeys.REFRESH_TOKEN)
		}

		return noStore(response)
	}
}
