import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import { serverService } from "@/api/server-instance"
import { CookieStorageKeys } from "@/libs/constants"

export async function POST() {
	const response = NextResponse.json({
		success: true
	})

	try {
		const cookieStore = await cookies()

		const refreshToken = cookieStore.get(CookieStorageKeys.REFRESH_TOKEN)

		if (refreshToken) {
			await serverService.postAuthLogout({})
		}
	} catch {}

	response.cookies.delete(CookieStorageKeys.REFRESH_TOKEN)

	return response
}
