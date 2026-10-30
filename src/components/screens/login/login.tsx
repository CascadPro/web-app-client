"use client"

import { FormProvider } from "react-hook-form"

import { Button, Stagger, StaggerItem, Title } from "@/components/ui"
import { FormInput } from "@/components/ui/components/form-input"
import { VALUES } from "@/libs/constants"

import { useLoginPage } from "./hooks/useLogin"

export const LoginScreen = () => {
	const { form, handleSubmit, status } = useLoginPage()

	const isLoading = status === "loading"
	const disabled = status === "error" || status === "success" || isLoading

	return (
		<FormProvider {...form}>
			<form onSubmit={handleSubmit}>
				<Title size="lg">Вход в систему</Title>

				<Stagger
					className="absolute -top-4 left-0 flex h-full w-full flex-col items-center justify-center px-6"
					stagger={0.07}
					delay={0.05}
				>
					<StaggerItem className="w-full">
						<FormInput
							type="text"
							name="email"
							label={"Эл. почта"}
							placeholder="Введите эл.почту"
							containerClassName="w-full mb-12"
							required
						/>
					</StaggerItem>

					<StaggerItem className="w-full">
						<FormInput
							type="password"
							name="password"
							label={"Пароль"}
							placeholder="Введите пароль"
							containerClassName="w-full mb-12"
							maxLength={VALUES.MAX_PASSWORD_LENGTH}
							required
						/>
					</StaggerItem>

					<StaggerItem className="flex w-full justify-center">
						<Button
							variant="default"
							type="submit"
							className="w-[85%] p-2"
							isLoading={isLoading}
							disabled={disabled}
						>
							Войти в систему
						</Button>
					</StaggerItem>
				</Stagger>
			</form>
		</FormProvider>
	)
}
