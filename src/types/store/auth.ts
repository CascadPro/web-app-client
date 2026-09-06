import type { UsersTransportHttpGetCurrentUserResponse } from "@/api/generated"

export type AuthStoreStatus = "loading" | "authenticated" | "unauthenticated"

export type AuthStoreUser = UsersTransportHttpGetCurrentUserResponse

export interface AuthStore {
	status: AuthStoreStatus
	user: AuthStoreUser | null

	setLoading: () => void
	setAuthenticated: (user: AuthStoreUser) => void
	setUnauthenticated: () => void

	reset: () => void
}
