"use client"

import type { ReactNode } from "react"

import { useRealtimeLifecycle } from "./hooks/realtime"

interface RealtimeProviderProps {
	children: ReactNode
}

export function RealtimeProvider({ children }: RealtimeProviderProps) {
	useRealtimeLifecycle()

	return children
}
