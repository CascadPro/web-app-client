import { type FC, type PropsWithChildren } from "react"

import { cn } from "@/libs/utils"

import { useFormDefaultTextarea } from "../../hooks/useFormDefaultTextarea"
import styles from "../../styles/default-input.module.css"
import type { FormDefaultTextareaProps } from "../../types/form-input.type"
import { ClearButton } from "../clear-button"
import { TextareaCounter } from "../textarea-counter"

const DefaultTextarea: FC<PropsWithChildren<FormDefaultTextareaProps>> = ({
	name,
	clearBtnClassName,
	className,
	isLoading,
	label,
	children,
	counter,
	rows,
	cols,
	...props
}) => {
	const { clear, clearError, onInput, register, value } =
		useFormDefaultTextarea(name)

	let placeholder = ""
	if (!isLoading) {
		placeholder = props.placeholder || ""
	}

	return (
		<div className={styles["input-wrapper"]}>
			<textarea
				className={cn(
					"bg-secondary w-full resize-none overflow-y-hidden rounded-md p-1 outline-none",
					className
				)}
				onInput={onInput}
				rows={rows || 2}
				cols={cols || 30}
				{...props}
				placeholder={placeholder}
				spellCheck={true}
				disabled={props?.disabled || isLoading}
				{...register(name, { onChange: clearError })}
			/>

			{props.required && <span className={styles["required"]}>*</span>}

			{label && <span className={styles["label"]}>{label}</span>}

			{children}

			{counter && (
				<TextareaCounter
					length={String(value).length}
					maxLength={props.maxLength}
				/>
			)}

			<ClearButton
				onClick={clear}
				value={value}
				className={cn(clearBtnClassName, "top-2.5!")}
			/>
		</div>
	)
}

export { DefaultTextarea }
