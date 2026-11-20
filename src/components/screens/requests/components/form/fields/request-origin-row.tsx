"use client"

import { Trash2Icon } from "lucide-react"
import { type FC, memo } from "react"

import { Button, Input, PhoneInput, SegmentedControl } from "@/components/ui"
import { REQUEST_ORIGIN_TYPES } from "@/libs/constants/screens/requests"
import { normalizeEmail } from "@/libs/utils/phone"

import { useRequestOriginRow } from "../../../hooks/useRequestOriginRow"

import { FieldError } from "./field-error"

interface Props {
	index: number
	onRemove: (index: number) => void
}

const RequestOriginRowComponent: FC<Props> = ({ index, onRemove }) => {
	const {
		typeField,
		emailField,
		phoneField,
		otherField,
		currentValueField,
		errorId,
		error,
		handleType
	} = useRequestOriginRow(index)

	const type = typeField.value
	const value = currentValueField.value ?? ""

	const common = {
		spellCheck: false,
		maxLength: 255,
		"aria-label": "Значение контакта",
		"aria-invalid": error ? true : undefined,
		"aria-describedby": error ? errorId : undefined,
		className:
			"ring-outline/40 focus-visible:ring-primary rounded-xl py-3 ring",
		onBlur: currentValueField.onBlur
	} as const

	return (
		<div className="border-outline/20 bg-surface/40 flex flex-col gap-2 rounded-2xl border p-2.5">
			<div className="flex items-start gap-2">
				<SegmentedControl
					size="sm"
					label="Тип контакта"
					className="min-w-0 flex-1"
					value={type}
					options={REQUEST_ORIGIN_TYPES}
					onChange={handleType}
				/>

				<Button
					variant="destructive"
					className="shrink-0 p-2.5"
					aria-label="Удалить контакт"
					onClick={() => onRemove(index)}
				>
					<Trash2Icon size={16} />
				</Button>
			</div>

			{type === "phone" ? (
				<PhoneInput
					{...common}
					name={phoneField.name}
					inputRef={phoneField.ref}
					value={value}
					onValueChange={phoneField.onChange}
				/>
			) : type === "email" ? (
				<Input
					{...common}
					name={emailField.name}
					ref={emailField.ref}
					value={value}
					onChange={(e) => {
						const normalized = normalizeEmail(e.target.value)
						emailField.onChange(normalized)
					}}
					type="email"
					inputMode="email"
					autoComplete="off"
					placeholder="name@company.ru"
				/>
			) : (
				<Input
					{...common}
					name={otherField.name}
					ref={otherField.ref}
					value={value}
					onChange={otherField.onChange}
					type="text"
					inputMode="text"
					autoComplete="off"
					placeholder="Мессенджер, ссылка или заметка"
				/>
			)}

			<FieldError id={errorId} message={error} />
		</div>
	)
}

export const RequestOriginRow = memo(RequestOriginRowComponent)
RequestOriginRow.displayName = "RequestOriginRow"