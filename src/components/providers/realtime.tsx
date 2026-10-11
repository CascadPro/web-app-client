"use client"

import dynamic from "next/dynamic"
import type { ReactNode } from "react"

import { useRealtimeLifecycle } from "./hooks/realtime"

const DynamicRealtimeStatusIndicator = dynamic(
	async () =>
		(await import("@/components/ui/components/realtime-indicator"))
			.RealtimeStatusIndicator,
	{ ssr: false }
)

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
			<DynamicRealtimeStatusIndicator />
		</>
	)
}
