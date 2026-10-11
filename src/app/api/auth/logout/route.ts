import axios from "axios"
import { NextResponse } from "next/server"

import { serverService } from "@/api/server-instance"
import { CookieStorageKeys } from "@/libs/constants"
import { parseServerError } from "@/libs/errors"
import { isDev } from "@/libs/utils"

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

		if (isDev()) {
			console.error(parsed)
		}

		return NextResponse.json(
			{
				code: parsed.code ?? "internal_error",
				message: parsed.message ?? "Произошла внутренняя ошибка сервера",
				fields: parsed.fields
			},
			{ status }
		)
	}

	response.cookies.delete(CookieStorageKeys.REFRESH_TOKEN)

	return response
}
