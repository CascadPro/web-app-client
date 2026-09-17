import { QueryClient } from "@tanstack/react-query"

import { ms } from "../utils"

export const queryClient = new QueryClient({
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
