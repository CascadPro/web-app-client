"use client"

import { FormProvider } from "react-hook-form"

import { Button, Title } from "@/components/ui"
import { FormInput } from "@/components/ui/components/form-input"

import { useLoginPage } from "./hooks/useLogin"

export const LoginPage = () => {
	const { form, handleSubmit } = useLoginPage()

	return (
		<FormProvider {...form}>
			<form onSubmit={handleSubmit}>
				<Title size="lg">Вход в систему</Title>

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
						required
					/>

					<Button
						variant="default"
						type="submit"
						className="w-[85%] self-center p-2"
					>
						Войти в систему
					</Button>
				</div>
			</form>
		</FormProvider>
	)
}
