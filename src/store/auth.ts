import { create } from "zustand"

import type { AuthStore } from "@/types/store"

export const useAuthStore = create<AuthStore>(set => ({
	status: "loading",
	user: null,
	accessToken: null,

	setLoading: () => set({ status: "loading" }),

	setAccessToken: accessToken => set({ accessToken }),

	setAuthenticated: user => set({ status: "authenticated", user }),

	setUnauthenticated: () =>
		set({ status: "unauthenticated", user: null, accessToken: null }),

	reset: () => set({ status: "unauthenticated", user: null, accessToken: null })
}))
