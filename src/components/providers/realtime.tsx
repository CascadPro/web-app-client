"use client"

import type { ReactNode } from "react"

import { RealtimeStatusIndicator } from "../ui/components/realtime-indicator"

import { useRealtimeLifecycle } from "./hooks/realtime"

interface RealtimeProviderProps {
	children: ReactNode
}

export function RealtimeProvider({
	children
}: Readonly<RealtimeProviderProps>) {
	useRealtimeLifecycle()

	return (
		<>
			{children}
			<RealtimeStatusIndicator />
		</>
	)
}
