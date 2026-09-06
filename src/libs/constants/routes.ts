export const AppRoutes = {
	INDEX: "/",
	START: "/start",
	ABOUT: "/about",
	OFFLINE: "/offline",
	MENU: "/menu",

	AUTH: "/auth",
	REGISTER: "/auth/register",
	LOGIN: "/auth/login"
} as const

export type AppRoutes = (typeof AppRoutes)[keyof typeof AppRoutes]
