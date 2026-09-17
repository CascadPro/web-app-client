import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"

import { Toast } from "@/components/ui"
import { register } from "@/libs/auth"
import { AppRoutes } from "@/libs/constants"
import { useHaptic } from "@/libs/haptics"
import { RegisterFormFields, registerScheme } from "@/libs/schemes"
import { errorCatch } from "@/libs/utils"
import { useAuthStore } from "@/store/auth"

type Status = "default" | "loading" | "success" | "error"

export const useRegisterPage = () => {
	const form = useForm({
		resolver: zodResolver(registerScheme),
		defaultValues: { email: "", password: "", token: "" },
		mode: "onBlur"
	})

	const { replace } = useRouter()

	const { haptic } = useHaptic()

	const [status, setStatus] = useState<Status>("default")

	const stateLogin = useAuthStore(state => state.setAuthenticated)

	const onSubmitFn = useCallback(
		async (data: RegisterFormFields) => {
			if (["loading", "success", "error"].includes(status)) return

			setStatus("loading")

			const { email, password, token } = data

			try {
				await register({ email, password, token })

				stateLogin()

				Toast.show({ type: "success", text1: "Успешная регистрация!" })

				setStatus("success")
			} catch (error) {
				haptic("medium")

				Toast.show({
					type: "error",
					text1: "Не удалось зарегистрироваться!",
					text2: errorCatch(error).message
				})

				setStatus("error")
			}
		},
		[status]
	)

	useEffect(() => {
		if (status === "success") {
			setTimeout(() => replace(AppRoutes.MENU), 5000)
		} else if (status === "error") {
			setTimeout(() => setStatus("default"), 2000)
		}
	}, [status])

	const handleSubmit = form.handleSubmit(onSubmitFn)

	return {
		form,
		handleSubmit,
		status
	}
}
