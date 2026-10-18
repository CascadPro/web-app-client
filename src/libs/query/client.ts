import { QueryClient } from "@tanstack/react-query"

import { ApiError } from "@/libs/errors/api"

import { ms } from "../utils"

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: ms("1min"),
			gcTime: ms("1h"),

			refetchOnWindowFocus: false,
			refetchOnReconnect: true,

			retry: (failureCount, error) => {
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
