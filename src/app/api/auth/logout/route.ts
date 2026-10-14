import axios from "axios"
import { NextResponse } from "next/server"

import { serverService } from "@/api/server-instance"
import { CookieStorageKeys } from "@/libs/constants"
import { parseServerError } from "@/libs/errors"

export async function POST() {
	const response = NextResponse.json({
		success: true
	})

	try {
		await serverService.postAuthLogout({})
	} catch (error) {
		const parsed = parseServerError(error)

		const status = axios.isAxiosError(error)
			? (error.response?.status ?? 500)
			: 500

		const response = NextResponse.json(
			{
				code: parsed.code ?? "internal_error",
				message: parsed.message ?? "Ошибка выхода из аккаунта"
			},
			{ status }
		)

		response.cookies.delete(CookieStorageKeys.REFRESH_TOKEN)
		response.headers.set("Cache-Control", "no-store")

		return response
	}

	response.cookies.delete(CookieStorageKeys.REFRESH_TOKEN)
	response.headers.set("Cache-Control", "no-store")

	return response
}
