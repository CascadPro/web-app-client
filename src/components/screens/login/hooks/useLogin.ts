import { zodResolver } from "@hookform/resolvers/zod"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"

import {
	toast,
	TOAST_ERROR_DURATION,
	TOAST_SUCCESS_DURATION
} from "@/components/ui/toast"
import { login } from "@/libs/auth"
import { AppRoutes } from "@/libs/constants"
import { useHaptic } from "@/libs/haptics"
import { useNavigation } from "@/libs/hooks"
import { type LoginFormFields, loginScheme } from "@/libs/schemes"
import { errorCatch } from "@/libs/utils"
import { useAuthStore } from "@/store/auth"

type Status = "default" | "loading" | "success" | "error"

export const useLoginPage = () => {
	const form = useForm({
		resolver: zodResolver(loginScheme),
		defaultValues: { email: "", password: "" },
		mode: "onBlur"
	})

	const { replace } = useNavigation()

	const { haptic } = useHaptic()

	const [status, setStatus] = useState<Status>("default")

	const stateLogin = useAuthStore(state => state.setAuthenticated)

	const onSubmitFn = useCallback(
		async (data: LoginFormFields) => {
			if (["loading", "success", "error"].includes(status)) return

			setStatus("loading")

			const id = toast.loading("Входим в систему...", { dismissible: false })

			const { email, password } = data

			try {
				await login({ email, password })

				stateLogin()

				toast.update(id, {
					type: "success",
					title: "Успешный вход!",
					duration: TOAST_SUCCESS_DURATION
				})

				setStatus("success")
			} catch (error) {
				const description =
					((error as any)?.message as string) || errorCatch(error).message

				haptic("medium")
				setStatus("error")

				toast.update(id, {
					type: "error",
					title: "Не удалось войти!",
					description,
					duration: TOAST_ERROR_DURATION
				})
			}
		},
		[status]
	)

	useEffect(() => {
		if (status === "success") {
			setTimeout(() => replace(AppRoutes.MENU), 2000)
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
