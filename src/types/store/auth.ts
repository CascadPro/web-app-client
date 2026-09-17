export type AuthStoreStatus = "loading" | "authenticated" | "unauthenticated"

export interface AuthStore extends AuthStoreActions {
	status: AuthStoreStatus
	accessToken: string | null
}

interface AuthStoreActions {
	setLoading: () => void

	setAccessToken: (accessToken: string) => void

	setAuthenticated: () => void

	setUnauthenticated: () => void

	reset: () => void
}
