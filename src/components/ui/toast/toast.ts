import type { ToastData, ToastListener, ToastOptions, ToastType } from "./types"

const MAX_TOASTS = 3
const DEFAULT_DURATION = 3000

let items: ToastData[] = []
let counter = 0

const listeners = new Set<ToastListener>()

function emit() {
	const snapshot = [...items]

	listeners.forEach(listener => listener(snapshot))
}

function dismiss(id: string) {
	const next = items.filter(item => item.id !== id)

	if (next.length === items.length) return

	items = next
	emit()
}

function show(type: ToastType, title: string, options: ToastOptions = {}) {
	const id = `toast-${++counter}`

	const item: ToastData = {
		...options,
		id,
		type,
		title,
		createdAt: Date.now(),
		duration:
			type === "loading"
				? 0
				: Math.max(0, options.duration ?? DEFAULT_DURATION),
		dismissible: options.dismissible ?? true,
		position: options.position ?? "top-right"
	}

	if (items.length >= MAX_TOASTS) {
		const oldest = items.find(entry => entry.type !== "loading")

		if (oldest) {
			items = items.filter(entry => entry.id !== oldest.id)
		} else if (type !== "loading") {
			return id
		}
	}

	items = [...items, item]
	emit()

	return id
}

export const toast = {
	show: (type: ToastType, title: string, options?: ToastOptions) =>
		show(type, title, options),

	success: (title: string, options?: ToastOptions) =>
		show("success", title, options),

	error: (title: string, options?: ToastOptions) =>
		show("error", title, options),

	info: (title: string, options?: ToastOptions) => show("info", title, options),

	warning: (title: string, options?: ToastOptions) =>
		show("warning", title, options),

	loading: (title: string, options?: ToastOptions) =>
		show("loading", title, options),

	dismiss,

	dismissAll() {
		if (!items.length) return

		items = []
		emit()
	},

	update(id: string, updates: Partial<ToastData>) {
		const exists = items.some(item => item.id === id)
		if (!exists) return

		items = items.map(item => {
			if (item.id !== id) return item

			const next = { ...item, ...updates, id }

			if (updates.duration !== undefined) {
				next.duration =
					next.type === "loading" ? 0 : Math.max(0, updates.duration)
			} else if (
				updates.type &&
				updates.type !== "loading" &&
				item.type === "loading"
			) {
				next.duration = 3000
			}

			return next
		})

		emit()
	},

	subscribe(listener: ToastListener) {
		listeners.add(listener)
		listener([...items])

		return () => {
			listeners.delete(listener)
		}
	}
}
