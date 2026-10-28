import type { Query } from "@tanstack/react-query"
import { QueryClient } from "@tanstack/react-query"

import { ApiError } from "@/libs/errors/api"

import { IS_DEV_ENV, ms } from "../utils"

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: ms("1min"),
			gcTime: ms("1h"),

			refetchOnWindowFocus: false,
			refetchOnReconnect: true,

			retry: (failureCount: number, error: unknown) => {
				if (
					error instanceof ApiError &&
					(error.status === 401 || error.status === 403)
				) {
					return false
				}

				return failureCount < 1
			}
		},
		mutations: {
			retry: 0
		}
	}
})

queryClient.getQueryCache().subscribe(event => {
	if (event.type === "updated" && event.action.type === "error") {
		const query = event.query as Query
		if (IS_DEV_ENV) {
			console.error(
				"[Query] Error:",
				event.action.error,
				"in query:",
				query.queryKey
			)
		}
	}
})

queryClient.getMutationCache().subscribe(event => {
	if (event.type === "updated" && event.action.type === "error") {
		if (IS_DEV_ENV) {
			console.error("[Query] Mutation error:", event.action.error)
		}
	}
})
