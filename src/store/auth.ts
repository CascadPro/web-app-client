import { create } from "zustand"

import type { AuthStore } from "@/types/store"

export const useAuthStore = create<AuthStore>(set => ({
	status: "loading",
	user: null,

	setLoading: () =>
		set({
			status: "loading"
		}),

	setAuthenticated: user =>
		set({
			status: "authenticated",
			user
		}),

	setUnauthenticated: () =>
		set({
			status: "unauthenticated",
			user: null
		}),

	reset: () =>
		set({
			status: "unauthenticated",
			user: null
		})
}))
