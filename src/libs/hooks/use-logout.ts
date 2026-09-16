import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

import { logout } from "@/libs/auth"
import { AppRoutes } from "@/libs/constants"

export const useLogout = () => {
	const client = useQueryClient()
	const router = useRouter()

	return async () => {
		await logout()

		client.clear()
		client.invalidateQueries()

		router.replace(AppRoutes.LOGIN)
		router.refresh()
	}
}
