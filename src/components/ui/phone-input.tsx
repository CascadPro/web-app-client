"use client"

import { type FC, type InputHTMLAttributes, type Ref, useMemo } from "react"

import styles from "@/components/ui/components/form-input/styles/default-input.module.css"
import { Input } from "@/components/ui/input"
import { useIMask } from "@/libs/hooks/use-imask"
import { cn } from "@/libs/utils"
import { mergeRefs } from "@/libs/utils/merge-refs"
import { RU_PHONE_MASK_OPTIONS, RU_PHONE_PLACEHOLDER } from "@/libs/utils/phone"

export interface PhoneInputProps extends Omit<
	InputHTMLAttributes<HTMLInputElement>,
	"value" | "defaultValue" | "onChange" | "type"
> {
	/** Значение в виде с маской: «+7 (900) 000-00-00» */
	value: string
	onValueChange: (value: string) => void
	inputRef?: Ref<HTMLInputElement>
}

/** Поле телефона с маской imask. Подставляет +7 сам, понимает вставку «8 900 …» */
export const PhoneInput: FC<PhoneInputProps> = ({
	value,
	onValueChange,
	inputRef,
	placeholder = RU_PHONE_PLACEHOLDER,
	...props
}) => {
	const maskRef = useIMask({
		options: RU_PHONE_MASK_OPTIONS,
		value,
		onAccept: onValueChange
	})

	const ref = useMemo(() => mergeRefs(maskRef, inputRef), [maskRef, inputRef])

	return (
		<Input
			{...props}
			ref={ref}
			type="tel"
			inputMode="tel"
			autoComplete="tel"
			placeholder={placeholder}
		/>
	)
}

export const PhoneInputWithLabel = ({
	name,
	label,
	placeholder,
	containerClassName,
	required,
	autoComplete,
	value,
	onValueChange
}: {
	name: string
	label: string
	placeholder: string
	containerClassName?: string
	required?: boolean
	autoComplete?: string
	value: string
	onValueChange: (value: string) => void
}) => {
	const labelId = `label-${name}`

	return (
		<div className={cn(styles.wrapper, containerClassName)}>
			<div className={styles["input-wrapper"]}>
				<PhoneInput
					name={name}
					placeholder={placeholder}
					autoComplete={autoComplete}
					value={value}
					onValueChange={onValueChange}
				/>

				{required && <span className={styles["required"]}>*</span>}

				{label && (
					<span id={labelId} className={styles["label"]}>
						{label}
					</span>
				)}
			</div>
		</div>
	)
}
