"use client"

import {
	createContext,
	type FC,
	type ReactNode,
	useContext,
	useEffect,
	useMemo
} from "react"

import { service } from "@/api/instance"
import { CookieStorageKeys } from "@/libs/constants"
import { CookieStorage } from "@/libs/utils"
import { useAuthStore } from "@/store/auth"

interface AuthContextValue {
	isLoading: boolean
	isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

interface AuthProviderProps {
	children: ReactNode
}

export const AuthProvider: FC<AuthProviderProps> = ({
	children
}: AuthProviderProps) => {
	const status = useAuthStore(state => state.status)
	const setAuthenticated = useAuthStore(state => state.setAuthenticated)
	const setUnauthenticated = useAuthStore(state => state.setUnauthenticated)

	useEffect(() => {
		let cancelled = false

		const bootstrap = async () => {
			const accessStorage = new CookieStorage(CookieStorageKeys.ACCESS_TOKEN)
			const refreshStorage = new CookieStorage(CookieStorageKeys.REFRESH_TOKEN)

			const [hasAccessToken] = accessStorage.get()
			const [hasRefreshToken] = refreshStorage.get()

			if (!hasAccessToken && !hasRefreshToken) {
				if (!cancelled) {
					setUnauthenticated()
				}

				return
			}

			try {
				const response = await service.getUsersMy()

				if (cancelled) {
					return
				}

				setAuthenticated(response.data)
			} catch {
				if (!cancelled) {
					setUnauthenticated()
				}
			}
		}

		bootstrap()

		return () => {
			cancelled = true
		}
	}, [setAuthenticated, setUnauthenticated])

	const value = useMemo(
		() => ({
			isLoading: status === "loading",
			isAuthenticated: status === "authenticated"
		}),
		[status]
	)

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
	const context = useContext(AuthContext)

	if (!context) {
		throw new Error("useAuth must be used inside AuthProvider")
	}

	return context
}
