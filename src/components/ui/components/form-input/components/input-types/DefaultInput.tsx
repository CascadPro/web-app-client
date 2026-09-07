import type { FC, PropsWithChildren } from "react"

import { Input, Skeleton } from "@/components/ui"
import { cn } from "@/libs/utils"

import { useFormDefaultInput } from "../../hooks/useFormDefaultInput"
import styles from "../../styles/default-input.module.css"
import type { FormDefaultInputProps } from "../../types/form-input.type"
import { ClearButton } from "../clear-button"
import { PasswordEye } from "../password-eye"

const DefaultInput: FC<PropsWithChildren<FormDefaultInputProps>> = ({
	name,
	setMask,
	clearBtnClassName,
	className,
	isLoading,
	label,
	children,
	...props
}) => {
	const {
		clear,
		clearError,
		isPassword,
		isShowPassword,
		onInput,
		showPassword,
		register,
		value
	} = useFormDefaultInput(name, setMask)

	let placeholder = ""
	if (!isLoading) {
		placeholder = props.placeholder || name
	}

	let type = props.type
	if (isPassword && isShowPassword) {
		type = "text"
	}

	return (
		<div className={styles["input-wrapper"]}>
			<Input
				className={className}
				onInput={onInput}
				spellCheck={false}
				{...props}
				placeholder={placeholder}
				type={type}
				disabled={props?.disabled || isLoading}
				{...register(name, { onChange: clearError })}
			/>

			{isLoading && (
				<div className="absolute top-1/2 left-3 flex -translate-y-1/2 items-center gap-3">
					<Skeleton className="h-4 w-4 rounded-full duration-700" />
					<Skeleton className="h-4 w-4 rounded-full delay-150 duration-700" />
					<Skeleton className="h-4 w-4 rounded-full delay-300 duration-700" />
				</div>
			)}

			{props.required && <span className={styles["required"]}>*</span>}

			{label && <span className={styles["label"]}>{label}</span>}

			{children}

			{isPassword && (
				<PasswordEye
					value={isShowPassword}
					onClick={showPassword}
					className="translate-y-[-45%]!"
				/>
			)}
			<ClearButton
				onClick={clear}
				value={value}
				className={cn(clearBtnClassName, "translate-y-[-45%]!")}
			/>
		</div>
	)
}

export { DefaultInput }
