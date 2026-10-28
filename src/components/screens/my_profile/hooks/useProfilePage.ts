import { useMemo } from "react"

import type { UsersTransportHttpGetCurrentUserResponse as User } from "@/api/generated"
import { useCurrentUser } from "@/libs/query/hooks"
import { useAuthStore } from "@/store/auth"
import type { AuthStoreStatus } from "@/types/store"

interface UseProfilePageReturn {
	status: AuthStoreStatus
	user: User | undefined
	fullName: string
	avatarUser: {
		avatar_file_id: string | undefined
		avatar_placeholder: string | undefined
		name: string | undefined
		surname: string | undefined
	}
	refetchUser: () => Promise<unknown>
	isLoading: boolean
	isFetching: boolean
	error: unknown
}

export const useProfilePage = (): UseProfilePageReturn => {
	const authStatus = useAuthStore(state => state.status)

	const { data, refetch, isLoading, isFetching, error } = useCurrentUser()

	const fullName = useMemo(
		() =>
			[data?.name, data?.surname, data?.last_name].filter(Boolean).join(" "),
		[data?.name, data?.surname, data?.last_name]
	)

	const avatarUser = useMemo(
		() => ({
			avatar_file_id: data?.avatar_file_id,
			avatar_placeholder: data?.avatar_placeholder,
			name: data?.name,
			surname: data?.surname
		}),
		[data?.avatar_file_id, data?.avatar_placeholder, data?.name, data?.surname]
	)

	return {
		status: authStatus,
		user: data,
		fullName,
		avatarUser,
		refetchUser: refetch,
		isLoading: authStatus === "loading" || isLoading,
		isFetching,
		error
	}
}
