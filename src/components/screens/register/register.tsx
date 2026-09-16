"use client"

import { FormProvider } from "react-hook-form"

import { Button, Title } from "@/components/ui"
import { FormInput } from "@/components/ui/components/form-input"
import { VALUES } from "@/libs/constants"

import { useRegisterPage } from "./hooks/useRegister"

export const RegisterScreen = () => {
	const { form, handleSubmit, status } = useRegisterPage()

	const isLoading = status === "loading"
	const disabled = status === "error" || status === "success" || isLoading

	return (
		<FormProvider {...form}>
			<form onSubmit={handleSubmit}>
				<Title size="lg">Регистрация аккаунта</Title>

				<div className="absolute -top-4 left-0 flex h-full w-full flex-col items-center justify-center px-6">
					<FormInput
						type="text"
						name="email"
						label={"Эл. почта"}
						placeholder="Введите эл.почту"
						containerClassName="w-full mb-12"
						required
					/>

					<FormInput
						type="password"
						name="password"
						label={"Пароль"}
						placeholder="Введите пароль"
						containerClassName="w-full mb-12"
						maxLength={VALUES.MAX_PASSWORD_LENGTH}
						required
					/>

					<FormInput
						type="text"
						name="token"
						label={"Ключ регистрации"}
						placeholder="Вставьте ключ"
						containerClassName="w-full mb-12"
						required
					/>
					<Button
						variant="default"
						type="submit"
						className="w-[85%] self-center p-2"
						isLoading={isLoading}
						disabled={disabled}
					>
						Зарегистрироваться
					</Button>
				</div>
			</form>
		</FormProvider>
	)
}
