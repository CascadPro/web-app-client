import { AxiosError } from "axios"
import { headers } from "next/headers"
import { NextResponse } from "next/server"

import type { AuthTransportHttpLoginRequest } from "@/api/generated"
import { serverService } from "@/api/server-instance"
import { CookieStorageKeys } from "@/libs/constants"

const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 30

export async function POST(request: Request) {
	try {
		const body = (await request.json()) as AuthTransportHttpLoginRequest

		const response = await serverService.postAuthLogin(
			{
				email: body.email,
				password: body.password
			},
			{
				headers: {
					"User-Agent": (await headers()).get("user-agent") ?? ""
				}
			}
		)

		const { access_token, refresh_token } = response.data

		if (!access_token || !refresh_token) {
			return NextResponse.json(
				{ message: "Invalid authentication response" },
				{ status: 502 }
			)
		}

		const nextResponse = NextResponse.json({
			access_token
		})

		nextResponse.cookies.set(CookieStorageKeys.REFRESH_TOKEN, refresh_token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			path: "/",
			maxAge: REFRESH_TOKEN_MAX_AGE
		})

		return nextResponse
	} catch (error) {
		if (error instanceof AxiosError) {
			const status = error.response?.status ?? 500
			const data = error.response?.data

			return NextResponse.json(data ?? { message: "Authentication failed" }, {
				status
			})
		}

		console.error("Login failed:", error)

		return NextResponse.json(
			{ message: "Authentication failed" },
			{ status: 500 }
		)
	}
}
