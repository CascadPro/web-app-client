import { create } from "zustand"

import type { RequestsUiStore } from "@/types/store"

const HIGHLIGHT_DURATION = 2600

let timer: ReturnType<typeof setTimeout> | null = null

const stopTimer = () => {
	if (timer === null) return

	clearTimeout(timer)
	timer = null
}

export const useRequestsUiStore = create<RequestsUiStore>(set => ({
	highlightId: null,

	highlight: id => {
		stopTimer()
		set({ highlightId: id })

		timer = setTimeout(() => {
			timer = null
			set({ highlightId: null })
		}, HIGHLIGHT_DURATION)
	},

	clearHighlight: () => {
		stopTimer()
		set({ highlightId: null })
	}
}))
