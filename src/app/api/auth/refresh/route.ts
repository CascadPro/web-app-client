import { AxiosError } from "axios"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import { serverService } from "@/api/server-instance"
import { CookieStorageKeys } from "@/libs/constants"

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

		return NextResponse.json({ access_token })
	} catch (error) {
		const nextResponse = NextResponse.json(
			{ message: "Refresh token is invalid" },
			{
				status:
					error instanceof AxiosError ? (error.response?.status ?? 401) : 401
			}
		)

		nextResponse.cookies.delete(CookieStorageKeys.REFRESH_TOKEN)

		return nextResponse
	}
}
