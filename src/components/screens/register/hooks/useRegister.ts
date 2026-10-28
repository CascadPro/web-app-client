import { zodResolver } from "@hookform/resolvers/zod"
import { useCallback, useEffect, useState } from "react"
import type { UseFormReturn } from "react-hook-form"
import { useForm } from "react-hook-form"

import {
	toast,
	TOAST_ERROR_DURATION,
	TOAST_SUCCESS_DURATION
} from "@/components/ui/toast"
import { register } from "@/libs/auth"
import { AppRoutes } from "@/libs/constants"
import { useHaptic } from "@/libs/haptics"
import { useNavigation } from "@/libs/hooks"
import { RegisterFormFields, registerScheme } from "@/libs/schemes"
import { errorCatch } from "@/libs/utils"
import { useAuthStore } from "@/store/auth"

type Status = "default" | "loading" | "success" | "error"

interface UseRegisterPageReturn {
	form: UseFormReturn<RegisterFormFields>
	handleSubmit: () => void
	status: Status
}

export const useRegisterPage = (): UseRegisterPageReturn => {
	const form = useForm({
		resolver: zodResolver(registerScheme),
		defaultValues: { email: "", password: "", token: "" },
		mode: "onBlur"
	})

	const { replace } = useNavigation()

	const { haptic } = useHaptic()

	const [status, setStatus] = useState<Status>("default")

	const stateLogin = useAuthStore(state => state.setAuthenticated)

	const onSubmitFn = useCallback(
		async (data: RegisterFormFields) => {
			if (["loading", "success", "error"].includes(status)) return

			setStatus("loading")

			const id = toast.loading("Проходим регистрацию...", {
				dismissible: false
			})

			const { email, password, token } = data

			try {
				await register({ email, password, token })

				stateLogin()

				toast.update(id, {
					type: "success",
					title: "Успешная регистрация!",
					duration: TOAST_SUCCESS_DURATION
				})

				setStatus("success")
			} catch (error) {
				haptic("medium")

				toast.update(id, {
					type: "error",
					title: "Не удалось зарегистрироваться!",
					description: errorCatch(error).message,
					duration: TOAST_ERROR_DURATION
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
