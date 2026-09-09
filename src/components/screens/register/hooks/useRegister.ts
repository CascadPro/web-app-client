import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"

import { service } from "@/api/instance"
import { Toast } from "@/components/ui"
import { register } from "@/libs/auth"
import { AppRoutes } from "@/libs/constants"
import { RegisterFormFields, registerScheme } from "@/libs/schemes"
import { errorCatch } from "@/libs/utils"
import { useAuthStore } from "@/store/auth"

export const useRegisterPage = () => {
	const form = useForm({
		resolver: zodResolver(registerScheme),
		defaultValues: { email: "", password: "", token: "" },
		mode: "onBlur"
	})

	const { replace } = useRouter()

	const stateLogin = useAuthStore(state => state.setAuthenticated)

	const onSubmitFn = async (data: RegisterFormFields) => {
		const { email, password, token } = data

		try {
			await register({ email, password, token })

			const user = await service.getUsersMy()

			stateLogin(user.data)

			Toast.show({ type: "success", text1: "Успешная регистрация!" })

			setTimeout(() => replace(AppRoutes.MENU), 5000)
		} catch (error) {
			const e = errorCatch(error)
			Toast.show({
				type: "error",
				text1: "Не удалось зарегистрироваться!",
				text2: e.message
			})
		}
	}

	const handleSubmit = form.handleSubmit(onSubmitFn)

	return {
		form,
		handleSubmit
	}
}
