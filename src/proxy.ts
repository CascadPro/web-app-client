import { NextRequest, NextResponse } from "next/server"

import { AppRoutes, CookieStorageKeys } from "@/libs/constants"

const PUBLIC_ROUTES = [
	AppRoutes.LOGIN,
	AppRoutes.REGISTER,
	AppRoutes.START,
	AppRoutes.ABOUT,
	AppRoutes.OFFLINE
]

const isPublicRoute = (pathname: string) => {
	return PUBLIC_ROUTES.some(
		route => pathname === route || pathname.startsWith(`${route}/`)
	)
}

export function proxy(request: NextRequest, response: NextResponse) {
	const { pathname } = request.nextUrl

	if (
		pathname.startsWith("/_next") ||
		pathname.startsWith("/api") ||
		pathname.includes(".")
	) {
		return NextResponse.next()
	}

	const accessToken = request.cookies.get(CookieStorageKeys.ACCESS_TOKEN)?.value

	const refreshToken = request.cookies.get(
		CookieStorageKeys.REFRESH_TOKEN
	)?.value

	const authenticated = Boolean(accessToken) || Boolean(refreshToken)

	/**
	 * Неавторизованный пользователь
	 * пытается открыть protected route.
	 */
	if (!authenticated && !isPublicRoute(pathname)) {
		const url = request.nextUrl.clone()

		url.pathname = "/auth/login"
		url.searchParams.set("redirect", pathname)

		return NextResponse.redirect(url)
	}

	if (
		authenticated &&
		(pathname === "/auth/login" || pathname === "/auth/register")
	) {
		return NextResponse.redirect(new URL("/", request.url))
	}

	return NextResponse.next()
}

export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
}
