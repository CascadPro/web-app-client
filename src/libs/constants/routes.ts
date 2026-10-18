export const AppRoutes = {
	INDEX: "/",
	START: "/start",
	ABOUT: "/about",
	OFFLINE: "/offline",

	MENU: "/menu",
	SESSIONS: "/sessions",
	REQUESTS: "/requests",
	SETTINGS: "/settings",

	PROFILE: "/profile",
	MY_PROFILE: "/profile/me",

	AUTH: "/auth",
	REGISTER: "/auth/register",
	LOGIN: "/auth/login"
} as const

export type AppRoutesKeys = (typeof AppRoutes)[keyof typeof AppRoutes]
