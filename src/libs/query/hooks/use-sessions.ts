import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { service } from "@/api/instance"
import { ms } from "@/libs/utils"
import { useAuthStore } from "@/store/auth"

import { QueryKeys } from "../keys"

export const useSessions = () => {
	const authStatus = useAuthStore(state => state.status)

	const query = useQuery({
		queryKey: QueryKeys.sessions.all,
		queryFn: service.getSessions,
		enabled: authStatus === "authenticated",
		staleTime: ms("1min"),
		gcTime: ms("30min"),
		refetchOnWindowFocus: true
	})

	return {
		sessions: query.data?.data.sessions ?? null,
		currentSession: query.data?.data.current_session ?? null,
		isLoading: authStatus === "loading" || query.isLoading,
		isFetching: query.isFetching,
		error: query.error,
		refetch: query.refetch
	}
}

export const useDeleteSession = (id: string) => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationKey: QueryKeys.sessions.delete(id),
		mutationFn: () => service.deleteSessionsId(id),
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: QueryKeys.sessions.all
			})
		}
	})
}

export const useDeleteSessions = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationKey: QueryKeys.sessions.deleteAll(),
		mutationFn: () => service.deleteSessionsDelete(),
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: QueryKeys.sessions.all
			})
		}
	})
}
