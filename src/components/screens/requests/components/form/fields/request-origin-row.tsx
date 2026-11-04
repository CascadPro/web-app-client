"use client"

import { Trash2Icon } from "lucide-react"
import { type FC, memo, useId } from "react"
import { useController, useFormContext } from "react-hook-form"

import { Button, Input, SegmentedControl } from "@/components/ui"
import {
	REQUEST_FORM_LIMITS,
	REQUEST_ORIGIN_INPUTS
} from "@/libs/constants/screens/request-form"
import { REQUEST_ORIGIN_TYPES } from "@/libs/constants/screens/requests"
import type { CreateRequestFormFields } from "@/libs/schemes"

import { FieldError } from "./field-error"

interface Props {
	index: number
	onRemove: (index: number) => void
}

const RequestOriginRowComponent: FC<Props> = ({ index, onRemove }) => {
	const { control, register, getValues, trigger, formState } =
		useFormContext<CreateRequestFormFields>()

	const errorId = useId()

	const { field: typeField } = useController({
		control,
		name: `origin.${index}.type`
	})

	const input = REQUEST_ORIGIN_INPUTS[typeField.value]
	const error = formState.errors.origin?.[index]?.value?.message

	const handleType = (next: typeof typeField.value) => {
		typeField.onChange(next)

		// Формат значения зависит от типа — перепроверяем уже введённое
		if (getValues(`origin.${index}.value`)) {
			void trigger(`origin.${index}.value`)
		}
	}

	return (
		<div className="border-outline/20 bg-surface/40 flex flex-col gap-2 rounded-2xl border p-2.5">
			<div className="flex items-start gap-2">
				<SegmentedControl
					size="sm"
					label="Тип контакта"
					className="min-w-0 flex-1"
					value={typeField.value}
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

			<Input
				{...register(`origin.${index}.value`)}
				type={input.inputType}
				inputMode={input.inputMode}
				autoComplete={input.autoComplete}
				placeholder={input.placeholder}
				spellCheck={false}
				maxLength={REQUEST_FORM_LIMITS.ORIGIN_VALUE_MAX}
				aria-label="Значение контакта"
				aria-invalid={error ? true : undefined}
				aria-describedby={error ? errorId : undefined}
				className="ring-outline/40 focus-visible:ring-primary rounded-xl py-3 ring"
			/>

			<FieldError id={errorId} message={error} />
		</div>
	)
}

export const RequestOriginRow = memo(RequestOriginRowComponent)
RequestOriginRow.displayName = "RequestOriginRow"
