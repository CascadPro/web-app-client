import { useMemo } from "react"

import type { UsersTransportHttpGetCurrentUserResponse } from "@/api/generated"
import { useLogout } from "@/libs/hooks/use-logout"
import { useCurrentUser } from "@/libs/query/hooks"
import { useAuthStore } from "@/store/auth"

interface UseMenuPageReturn {
	fullname: string
	user: UsersTransportHttpGetCurrentUserResponse | undefined
	loading: boolean
	logout: () => Promise<void>
}

export const useMenuPage = (): UseMenuPageReturn => {
	const status = useAuthStore(state => state.status)

	const { data: user } = useCurrentUser()

	const logout = useLogout()

	const fullname = useMemo(() => {
		return `${user?.name ?? ""} ${user?.surname ?? ""} ${user?.last_name ?? ""}`
	}, [user?.name, user?.surname, user?.last_name])

	return {
		fullname,
		user,
		loading: status === "loading",
		logout
	}
}
