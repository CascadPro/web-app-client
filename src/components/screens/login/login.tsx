"use client"

import { FormProvider } from "react-hook-form"

import {
	Button,
	SegmentedControl,
	Stagger,
	StaggerItem,
	Title
} from "@/components/ui"
import { FormInput } from "@/components/ui/components/form-input"
import { VALUES } from "@/libs/constants"

import { useLoginPage } from "./hooks/useLogin"

export const LoginScreen = () => {
	const {
		form,
		handleSubmit,
		status,
		method,
		handleEmailChange,
		handleMethodChange
	} = useLoginPage()

	const phoneValue = form.watch("phone")

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
					<StaggerItem className="mb-10 w-full">
						<SegmentedControl<typeof method>
							value={method}
							options={[
								{ value: "email", label: "Email" },
								{ value: "phone", label: "Телефон" }
							]}
							label="Способ входа"
							onChange={handleMethodChange}
							size="md"
						/>
					</StaggerItem>

					{method === "email" && (
						<StaggerItem className="w-full">
							<FormInput
								type="text"
								inputMode="email"
								name="email"
								label={"Эл. почта"}
								placeholder="Введите эл.почту"
								containerClassName="w-full mb-12"
								required
								onChange={e => handleEmailChange(e.target.value)}
							/>
						</StaggerItem>
					)}

					{method === "phone" && (
						<StaggerItem className="w-full">
							<FormInput
								name="phone"
								label={"Телефон"}
								placeholder="+7 (900) 000-00-00"
								containerClassName="w-full mb-12"
								required
								autoComplete="tel"
							/>
						</StaggerItem>
					)}

					<StaggerItem className="w-full">
						<FormInput
							type="password"
							inputMode="text"
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
							className="w-[85%] p-3"
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
