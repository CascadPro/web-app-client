import type { UsersTransportHttpGetCurrentUserResponse } from "@/api/generated"

export type AuthStoreStatus = "loading" | "authenticated" | "unauthenticated"

export type AuthStoreUser = UsersTransportHttpGetCurrentUserResponse

export interface AuthStore extends AuthStoreActions {
	status: AuthStoreStatus
	user: AuthStoreUser | null
	accessToken: string | null
}

interface AuthStoreActions {
	setLoading: () => void

	setAccessToken: (accessToken: string) => void

	setAuthenticated: (user: AuthStoreUser) => void

	setUnauthenticated: () => void

	reset: () => void
}
