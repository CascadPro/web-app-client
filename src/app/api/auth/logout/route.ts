import { AxiosError } from "axios"
import { NextResponse } from "next/server"

import { serverService } from "@/api/server-instance"
import { CookieStorageKeys } from "@/libs/constants"

export async function POST() {
	const response = NextResponse.json({
		success: true
	})

	try {
		await serverService.postAuthLogout({})
	} catch (error) {
		if (error instanceof AxiosError) {
			console.error("Logout failed:", error.response?.data)
		}
	}

	response.cookies.delete(CookieStorageKeys.REFRESH_TOKEN)

	return response
}
