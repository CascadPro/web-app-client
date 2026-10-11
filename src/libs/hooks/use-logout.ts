import { useCallback } from "react"

import { logout } from "@/libs/auth"
import { AppRoutes } from "@/libs/constants"

import { useNavigation } from "./use-navigation"

export const useLogout = () => {
	const router = useNavigation()

	return useCallback(async () => {
		await logout()

		router.replace(AppRoutes.LOGIN)
		router.refresh()
	}, [router])
}
