import { useQuery } from "@tanstack/react-query"

import { service } from "@/api/instance"
import { ms } from "@/libs/utils"
import { useAuthStore } from "@/store/auth"

import { QueryKeys } from "../keys"

export const useCurrentUser = () => {
	const status = useAuthStore(state => state.status)

	return useQuery({
		queryKey: QueryKeys.users.me(),
		queryFn: async () => (await service.getUsersMy()).data,
		enabled: status === "authenticated",

		staleTime: ms("5min"),
		gcTime: ms("24h")
	})
}
