import axios from "axios"
import { headers } from "next/headers"
import { NextResponse } from "next/server"

import type { AuthTransportHttpLoginRequest } from "@/api/generated"
import { serverService } from "@/api/server-instance"
import { CookieStorageKeys } from "@/libs/constants"
import { parseServerError } from "@/libs/errors"
import { isDev } from "@/libs/utils"

const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 30

export async function POST(request: Request) {
	try {
		const body = (await request.json()) as AuthTransportHttpLoginRequest

		const hasEmail = !!body.email
		const hasPhone = !!body.phone
		if (!hasEmail && !hasPhone) {
			return NextResponse.json(
				{ code: "validation_error", message: "Either email or phone must be provided", fields: { email: "Required" } },
				{ status: 400 }
			)
		}
		if (hasEmail && hasPhone) {
			return NextResponse.json(
				{ code: "validation_error", message: "Cannot provide both email and phone", fields: { email: "Provide only one" } },
				{ status: 400 }
			)
		}

		const loginRequest: AuthTransportHttpLoginRequest = {
			password: body.password
		}
		if (hasEmail) {
			loginRequest.email = body.email
		} else {
			loginRequest.phone = body.phone
		}

		const response = await serverService.postAuthLogin(
			loginRequest,
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
			{
				code: parsed.code ?? "internal_error",
				message: parsed.message ?? "Произошла внутренняя ошибка сервера",
				fields: parsed.fields
			},
			{ status }
		)

		nextResponse.headers.set("Cache-Control", "no-store, private")

		return nextResponse
	}
}
