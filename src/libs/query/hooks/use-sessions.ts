import { useMutation, useQuery } from "@tanstack/react-query"

import { service } from "@/api/instance"
import { useAuthStore } from "@/store/auth"

import { QueryKeys } from "../keys"

export const useSessions = () => {
	const state = useAuthStore(state => state.status)

	const { isLoading, ...other } = useQuery({
		queryKey: QueryKeys.sessions.all,
		queryFn: service.getSessions,
		enabled: state === "authenticated"
	})

	return { isLoading: isLoading || state === "loading", ...other }
}

export const useDeleteSession = (id: string) => {
	return useMutation({
		mutationKey: QueryKeys.sessions.delete(id),
		mutationFn: () => service.deleteSessionsId(id)
	})
}

export const useDeleteSessions = () => {
	return useMutation({
		mutationKey: QueryKeys.sessions.deleteAll(),
		mutationFn: () => service.deleteSessionsDelete()
	})
}
