import { create } from "zustand";

import type { AuthStore } from "@/types/store";

export const useAuthStore = create<AuthStore>(set => ({
	status: "loading",
	accessToken: null,

	setLoading: () => set({ status: "loading" }),

	setAccessToken: accessToken => set({ accessToken }),

	setAuthenticated: () => set({ status: "authenticated" }),

	setUnauthenticated: () =>
		set({ status: "unauthenticated", accessToken: null }),

	reset: () => set({ status: "unauthenticated", accessToken: null })
}))
