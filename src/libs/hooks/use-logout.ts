import { useRouter } from "next/navigation"
import { useCallback } from "react"

import { logout } from "@/libs/auth"
import { AppRoutes } from "@/libs/constants"

export const useLogout = () => {
	const router = useRouter()

	return useCallback(async () => {
		await logout()

		router.replace(AppRoutes.LOGIN)
		router.refresh()
	}, [router])
}
