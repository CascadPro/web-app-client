import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { service } from "@/api/instance"
import { ms } from "@/libs/utils"
import { useAuthStore } from "@/store/auth"

import { QueryKeys } from "../keys";

export const useSessions = () => {
	const state = useAuthStore(state => state.status)

	const { isLoading, ...other } = useQuery({
		queryKey: QueryKeys.sessions.all,
		queryFn: service.getSessions,
		enabled: state === "authenticated",
		staleTime: ms("5min"),
		gcTime: ms("10min")
	})

	return { isLoading: isLoading || state === "loading", ...other }
}

export const useDeleteSession = (id: string) => {
	const client = useQueryClient()

	return useMutation({
		mutationKey: QueryKeys.sessions.delete(id),
		mutationFn: () => service.deleteSessionsId(id),
		onSuccess: () =>
			client.invalidateQueries({ queryKey: QueryKeys.sessions.all })
	})
}

export const useDeleteSessions = () => {
	return useMutation({
		mutationKey: QueryKeys.sessions.deleteAll(),
		mutationFn: () => service.deleteSessionsDelete()
	})
}
