"use client"

import { useQueryClient } from "@tanstack/react-query"
import type { PropsWithChildren } from "react"

import { PullToRefresh } from "@/components/pwa/pwa-refresh-control"

export function RefreshControl({ children }: PropsWithChildren) {
	const queryClient = useQueryClient()

	const handleRefresh = async () => {
		await queryClient.invalidateQueries()
	}

	return (
		<PullToRefresh onRefresh={handleRefresh} threshold={100}>
			{children}
		</PullToRefresh>
	)
}
