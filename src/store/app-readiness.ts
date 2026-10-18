import { create } from "zustand"

interface AppReadinessStore {
	queryRestored: boolean
	setQueryRestored: () => void
}

export const useAppReadinessStore = create<AppReadinessStore>(set => ({
	queryRestored: false,
	setQueryRestored: () => set({ queryRestored: true })
}))
