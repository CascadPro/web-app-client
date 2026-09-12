import { useMutation, useQuery } from "@tanstack/react-query"

import { service } from "@/api/instance"

import { QueryKeys } from "../keys"

export const useSessions = () => {
	return useQuery({
		queryKey: QueryKeys.sessions.all,
		queryFn: service.getSessions
	})
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
