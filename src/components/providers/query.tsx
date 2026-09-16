"use client"

import { QueryClient } from "@tanstack/react-query"
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client"
import { type PropsWithChildren, useState } from "react";

import { persister } from "@/libs/query/persister"
import { ms } from "@/libs/utils"

export function QueryProvider({ children }: PropsWithChildren) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						staleTime: ms("1min"),
						gcTime: ms("24h"),

						refetchOnWindowFocus: false,
						refetchOnReconnect: true,

						retry: 1
					}
				}
			})
	)

	return (
		<PersistQueryClientProvider
			client={queryClient}
			persistOptions={{
				persister,
				maxAge: ms("1d")
			}}
		>
			{children}
		</PersistQueryClientProvider>
	)
}
