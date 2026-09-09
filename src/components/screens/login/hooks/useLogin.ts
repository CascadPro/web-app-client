import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"

import { service } from "@/api/instance"
import { Toast } from "@/components/ui"
import { login } from "@/libs/auth"
import { AppRoutes } from "@/libs/constants"
import { type LoginFormFields, loginScheme } from "@/libs/schemes"
import { errorCatch } from "@/libs/utils"
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
			const e = ((error as any)?.message as string) || errorCatch(error).message

			Toast.show({
				type: "error",
				text1: "Не удалось войти!",
				text2: e
			})
		}
	}

	const handleSubmit = form.handleSubmit(onSubmitFn)

	return {
		form,
		handleSubmit
	}
}
