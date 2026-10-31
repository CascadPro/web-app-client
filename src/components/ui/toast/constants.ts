import { AlertCircle, Check, Info, LoaderCircle, TriangleAlert } from "lucide-react"

import type { ToastPosition } from "./types"

export const TOAST_SUCCESS_DURATION = 3000
export const TOAST_ERROR_DURATION = 5000

export const TOAST_TYPE_ICONS = {
	success: Check,
	error: AlertCircle,
	info: Info,
	warning: TriangleAlert,
	loading: LoaderCircle
} as const

export const TOAST_TYPE_ACCENTS = {
	success: "text-success bg-success/15 ring-success/30",
	error: "text-error bg-error-container/20 ring-error/30",
	info: "text-primary bg-primary/20 ring-primary/30",
	warning: "text-warning bg-warning/15 ring-warning/30",
	loading: "text-primary bg-primary/20 ring-primary/30"
} as const

export const TOAST_POSITONS: Record<ToastPosition, string> = {
	"top-right":
		"top-[calc(var(--safe-area-top)+3.5rem)] right-[calc(var(--safe-area-right)+1rem)] items-end",
	"top-center":
		"top-[calc(var(--safe-area-top)+3.5rem)] left-1/2 -translate-x-1/2 items-center",
	"bottom-right":
		"bottom-[calc(var(--safe-area-bottom)+1rem)] right-[calc(var(--safe-area-right)+1rem)] items-end",
	"bottom-center":
		"bottom-[calc(var(--safe-area-bottom)+1rem)] left-1/2 -translate-x-1/2 items-center"
} as const
