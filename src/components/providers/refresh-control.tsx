"use client"

import { useQueryClient } from "@tanstack/react-query"
import dynamic from "next/dynamic"
import type { PropsWithChildren } from "react"

const DynamicPullToRefresh = dynamic(
	() =>
		import("@/components/pwa/pwa-refresh-control").then(
			mod => mod.PullToRefresh
		),
	{ ssr: false }
)

interface Props extends PropsWithChildren {
	queryKey?: string[]
}

export function RefreshControl({ children, queryKey }: Readonly<Props>) {
	const queryClient = useQueryClient()

	const handleRefresh = async () => {
		await queryClient.invalidateQueries(queryKey ? { queryKey } : {})
	}

	return (
		<DynamicPullToRefresh onRefresh={handleRefresh} threshold={100}>
			{children}
		</DynamicPullToRefresh>
	)
}
