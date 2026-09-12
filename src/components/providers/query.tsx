"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { type PropsWithChildren, useState } from "react"

export function QueryProvider({ children }: PropsWithChildren) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						staleTime: 30_000,
						gcTime: 5 * 60_000,
						refetchOnWindowFocus: false,
						retry: false
					}
				}
			})
	)

	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	)
}
