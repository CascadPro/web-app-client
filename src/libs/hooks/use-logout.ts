import { useRouter } from "next/navigation"

import { logout } from "@/libs/auth"
import { AppRoutes } from "@/libs/constants"

export const useLogout = () => {
	const router = useRouter()

	return async () => {
		await logout()

		router.replace(AppRoutes.LOGIN)
		router.refresh()
	}
}
