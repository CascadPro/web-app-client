"use client"

import { AnimatePresence } from "motion/react"
import { type FC, type PropsWithChildren, useId } from "react"

import { cn } from "@/libs/utils"

import { ErrorText } from "./components"
import { DefaultInput } from "./components/input-types/DefaultInput"
import { DefaultTextarea } from "./components/input-types/DefaultTextarea"
import { PhoneInput } from "./components/input-types/PhoneInput"
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
	variant: explicitType,
	...props
}) => {
	const { error, input_type: autoType } = useFormInput(name)
	const input_type = explicitType ?? autoType
	const id = useId()
	const errorId = `${id}-error`

	return (
		<div className={cn(styles["wrapper"], containerClassName)}>
			{input_type === "default" && (
				<DefaultInput
					name={name}
					setMask={setMask}
					clearBtnClassName={clearBtnClassName}
					isLoading={isLoading}
					errorId={errorId}
					{...props}
				/>
			)}

			{input_type === "textarea" && (
				<DefaultTextarea
					clearBtnClassName={clearBtnClassName}
					isLoading={isLoading}
					errorId={errorId}
					{...textareaProps}
					name={name}
					label={props.label}
				/>
			)}

			{input_type === "phone" && (
				<PhoneInput
					name={name}
					setMask={setMask}
					clearBtnClassName={clearBtnClassName}
					isLoading={isLoading}
					errorId={errorId}
					label={props.label}
					placeholder={props.placeholder}
					required={props.required}
					disabled={props.disabled}
					autoComplete={props.autoComplete}
					id={props.id}
				/>
			)}

			{children}

			<AnimatePresence>
				{error && (
					<ErrorText
						id={errorId}
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
