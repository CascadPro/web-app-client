"use client"

import { useQueryClient } from "@tanstack/react-query"
import type { PropsWithChildren } from "react"

import { PullToRefresh } from "@/components/pwa/pwa-refresh-control"

interface Props extends PropsWithChildren {
	queryKey?: string[]
}

export function RefreshControl({ children, queryKey }: Readonly<Props>) {
	const queryClient = useQueryClient()

	const handleRefresh = async () => {
		await queryClient.invalidateQueries(queryKey ? { queryKey } : {})
	}

	return (
		<PullToRefresh onRefresh={handleRefresh} threshold={100}>
			{children}
		</PullToRefresh>
	)
}
