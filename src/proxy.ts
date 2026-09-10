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

	const refreshToken = request.cookies.get(CookieStorageKeys.REFRESH_TOKEN)

	const authenticated = Boolean(refreshToken)

	if (!authenticated && !isPublicRoute(pathname)) {
		const url = request.nextUrl.clone()

		url.pathname = AppRoutes.LOGIN
		url.searchParams.set("redirect", pathname)

		return NextResponse.redirect(url)
	}

	if (
		authenticated &&
		(pathname === AppRoutes.LOGIN ||
			pathname === AppRoutes.REGISTER ||
			pathname === AppRoutes.START)
	) {
		return NextResponse.redirect(new URL("/", request.url))
	}

	return NextResponse.next()
}

export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
}
