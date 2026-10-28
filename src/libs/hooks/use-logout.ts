import { useCallback } from "react"

import { logout as logoutApi } from "@/libs/auth"
import { AppRoutes } from "@/libs/constants"

import { useNavigation } from "./use-navigation"

export const useLogout = () => {
	const router = useNavigation()

	const logoutFn = useCallback(async () => {
		await logoutApi()
		router.replace(AppRoutes.LOGIN)
	}, [router])

	return logoutFn
}
