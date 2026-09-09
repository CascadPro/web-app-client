import axios from "axios"
import { headers } from "next/headers"
import { NextResponse } from "next/server"

import type { AuthTransportHttpLoginRequest } from "@/api/generated"
import { serverService } from "@/api/server-instance"
import { CookieStorageKeys } from "@/libs/constants"
import { parseServerError } from "@/libs/errors"

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
		const parsed = parseServerError(error)
		const status = axios.isAxiosError(error)
			? (error.response?.status ?? 500)
			: 500

		return NextResponse.json(
			{
				code: parsed.code ?? "internal_error",
				message: parsed.message ?? "Произошла внутренняя ошибка сервера",
				fields: parsed.fields
			},
			{ status }
		)
	}
}
