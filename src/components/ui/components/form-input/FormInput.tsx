"use client"

import { AnimatePresence } from "motion/react"
import type { FC, PropsWithChildren } from "react"

import { cn } from "@/libs/utils"

import { ErrorText } from "./components"
import { DefaultInput } from "./components/input-types/DefaultInput"
import { DefaultTextarea } from "./components/input-types/DefaultTextarea"
import { useFormInput } from "./hooks/useFormInput"
import styles from "./styles/default-input.module.css"
import type { FormInputProps } from "./types/form-input.type"

const FormInput: FC<PropsWithChildren<FormInputProps>> = ({
	name,
	containerClassName,
	errorClassName,
	setMask,
	clearBtnClassName,
	caretClassName,
	align,
	isLoading,
	textareaProps,
	children,
	...props
}) => {
	const { error, input_type } = useFormInput(name)

	return (
		<div className={cn(styles["wrapper"], containerClassName)}>
			{input_type === "default" && (
				<DefaultInput
					name={name}
					setMask={setMask}
					clearBtnClassName={clearBtnClassName}
					isLoading={isLoading}
					{...props}
				/>
			)}

			{input_type === "textarea" && (
				<DefaultTextarea
					clearBtnClassName={clearBtnClassName}
					isLoading={isLoading}
					{...textareaProps}
					name={name}
					label={props.label}
				/>
			)}

			{children}

			<AnimatePresence>
				{error && (
					<ErrorText
						error={error as string}
						className={cn(
							"absolute -bottom-4 px-1.5 text-sm leading-3",
							errorClassName
						)}
					/>
				)}
			</AnimatePresence>
		</div>
	)
}
export { FormInput }
