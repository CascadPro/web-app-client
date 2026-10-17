export type ToastType = "success" | "error" | "info" | "warning" | "loading"

export type ToastPosition =
	"top-right" | "top-center" | "bottom-right" | "bottom-center"

export interface ToastOptions {
	description?: string
	duration?: number
	dismissible?: boolean
	position?: ToastPosition
	miniature?: boolean
	className?: string
	onClick?: () => void
}

export interface ToastData extends ToastOptions {
	id: string
	type: ToastType
	title: string
	createdAt: number
}

export type ToastListener = (toasts: ToastData[]) => void
