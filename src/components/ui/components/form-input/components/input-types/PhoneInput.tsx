"use client"

import { type FC, type PropsWithChildren, useMemo, useEffect, useRef, useCallback } from "react"

import { Input, Skeleton } from "@/components/ui"
import { cn, mergeRefs } from "@/libs/utils"
import { RU_PHONE_MASK_OPTIONS, RU_PHONE_PLACEHOLDER } from "@/libs/utils/phone"

import { useFormDefaultInput } from "../../hooks/useFormDefaultInput"
import styles from "../../styles/default-input.module.css"
import type { FormDefaultInputProps } from "../../types/form-input.type"
import { ClearButton } from "../clear-button"
import IMask from "imask"

type PhoneInputProps = PropsWithChildren<FormDefaultInputProps> & {
	value?: string
	onChange?: (value: string) => void
}

const PhoneInput: FC<PhoneInputProps> = ({
	name,
	setMask,
	clearBtnClassName,
	className,
	isLoading,
	label,
	errorId,
	children,
	value: controlledValue,
	onChange: controlledOnChange,
	...props
}) => {
	const labelId = useMemo(() => `label-${name}`, [name])

	const {
		clear,
		clearError,
		error,
		onInput,
		register,
		value: formValue,
		setValue
	} = useFormDefaultInput(name, setMask)

	// Detect if controlled mode (value + onChange passed explicitly)
	const isControlled = controlledValue !== undefined || controlledOnChange !== undefined

	// Use controlled value if provided, otherwise form value
	const value = isControlled ? controlledValue : formValue

	let placeholder = ""
	if (!isLoading) {
		placeholder = props.placeholder || RU_PHONE_PLACEHOLDER
	}

	// Store mask instance
	const maskRef = useRef<ReturnType<typeof IMask> | null>(null)
	const inputRef = useRef<HTMLInputElement | null>(null)

	// Initialize IMask on input element
	const attachMask = useCallback((element: HTMLInputElement | null) => {
		if (maskRef.current) {
			maskRef.current.destroy()
			maskRef.current = null
		}
		inputRef.current = element
		if (!element) return

		const mask = IMask(element, RU_PHONE_MASK_OPTIONS)
		mask.value = value ?? ""

		mask.on("accept", () => {
			const newValue = String(mask.value)
			if (isControlled && controlledOnChange) {
				controlledOnChange(newValue)
			} else {
				setValue(name, newValue, { shouldValidate: true })
			}
		})

		maskRef.current = mask
	}, [value, isControlled, controlledOnChange, name, setValue])

	// Sync mask value when controlled value changes externally
	useEffect(() => {
		if (isControlled && maskRef.current && controlledValue !== undefined) {
			maskRef.current.value = controlledValue
		}
	}, [controlledValue, isControlled])

	// Merge refs: imask attach + our internal ref
	const mergedRef = useMemo(
		() => mergeRefs(attachMask, inputRef),
		[attachMask]
	)

	const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
		onInput(e)
		// In controlled mode, also call controlled onChange with raw input value
		// (imask will emit "accept" with formatted value separately)
		if (isControlled && controlledOnChange) {
			controlledOnChange(e.currentTarget.value)
		}
	}

	return (
		<div className={styles["input-wrapper"]}>
			<Input
				className={cn(
					{
						"ring-error": error
					},
					className
				)}
				onInput={handleInput}
				spellCheck={false}
				{...props}
				placeholder={placeholder}
				type="tel"
				inputMode="tel"
				autoComplete="tel"
				disabled={props?.disabled || isLoading}
				aria-invalid={error ? true : undefined}
				aria-describedby={error ? errorId : props["aria-describedby"]}
				aria-labelledby={label ? labelId : props["aria-labelledby"]}
				ref={mergedRef}
			/>

			{isLoading && (
				<div className="absolute top-1/2 left-3 flex -translate-y-1/2 items-center gap-3">
					<Skeleton className="h-4 w-4 rounded-full duration-700" />
					<Skeleton className="h-4 w-4 rounded-full delay-150 duration-700" />
					<Skeleton className="h-4 w-4 rounded-full delay-300 duration-700" />
				</div>
			)}

			{props.required && <span className={styles["required"]}>*</span>}

			{label && (
				<span
					id={labelId}
					className={cn(styles["label"], {
						"text-on-surface!": error
					})}
				>
					{label}
				</span>
			)}

			{children}

			<ClearButton
				onClick={clear}
				value={value}
				className={cn(clearBtnClassName, "translate-y-[-45%]!")}
			/>
		</div>
	)
}

export { PhoneInput }