"use client"

import { useEffect, useRef } from "react"

import { refreshSession } from "@/libs/auth/auth"
import { useAuthStore } from "@/store/auth"

interface AuthProviderProps {
	children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
	const initialized = useRef(false)

	const setLoading = useAuthStore(state => state.setLoading)

	useEffect(() => {
		if (initialized.current) return

		initialized.current = true

		void initializeAuth()
	}, [])

	async function initializeAuth() {
		setLoading()

		try {
			await refreshSession()
		} catch {
			useAuthStore.getState().setUnauthenticated()
		}
	}

	return children
}
