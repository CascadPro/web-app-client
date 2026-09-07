export const CookieStorageKeys = {
	REFRESH_TOKEN: "refresh_token"
} as const

export type CookieStorageKeys =
	(typeof CookieStorageKeys)[keyof typeof CookieStorageKeys]
