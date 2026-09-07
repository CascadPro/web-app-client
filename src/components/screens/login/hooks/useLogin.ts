import { zodResolver } from "@hookform/resolvers/zod"
import type { AxiosError } from "axios"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"

import { errorCatch } from "@/api/helper"
import { service } from "@/api/instance"
import { Toast } from "@/components/ui"
import { login } from "@/libs/auth"
import { AppRoutes } from "@/libs/constants"
import { type LoginFormFields, loginScheme } from "@/libs/schemes"
import { useAuthStore } from "@/store/auth"

export const useLoginPage = () => {
	const form = useForm({
		resolver: zodResolver(loginScheme),
		defaultValues: { email: "", password: "" },
		mode: "onBlur"
	})

	const { replace } = useRouter()

	const stateLogin = useAuthStore(state => state.setAuthenticated)

	const onSubmitFn = async (data: LoginFormFields) => {
		const { email, password } = data

		try {
			await login({ email, password })

			const user = await service.getUsersMy()

			stateLogin(user.data)

			Toast.show({ type: "success", text1: "Успешный вход!" })

			setTimeout(() => replace(AppRoutes.MENU), 5000)
		} catch (error) {
			console.log(error)
			const { message, cause } = errorCatch(error as AxiosError)
			Toast.show({ type: "error", text1: "Не удалось войти!", text2: cause })
		}
	}

	const handleSubmit = form.handleSubmit(onSubmitFn)

	return {
		form,
		handleSubmit
	}
}
