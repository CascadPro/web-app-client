import { useId } from "react"
import { useController, useFormContext } from "react-hook-form"

import { CreateRequestFormFields } from "@/libs/schemes"

export const useRequestOriginRow = (index: number) => {
	const { control, trigger, formState } =
		useFormContext<CreateRequestFormFields>()

	const errorId = useId()

	const { field: typeField } = useController({
		control,
		name: `origin.${index}.type`
	})

	const { field: emailField } = useController({
		control,
		name: `origin.${index}.email`
	})

	const { field: phoneField } = useController({
		control,
		name: `origin.${index}.phone`
	})

	const { field: otherField } = useController({
		control,
		name: `origin.${index}.other`
	})

	// Get the current value field based on type
	const getCurrentValueField = () => {
		switch (typeField.value) {
			case "email":
				return emailField
			case "phone":
				return phoneField
			case "other":
				return otherField
			default:
				return emailField
		}
	}

	const currentValueField = getCurrentValueField()

	const error = formState.errors.origin?.[index]?.email?.message ??
		formState.errors.origin?.[index]?.phone?.message ??
		formState.errors.origin?.[index]?.other?.message ??
		formState.errors.origin?.[index]?.type?.message

	const handleType = (next: typeof typeField.value) => {
		typeField.onChange(next)

		// Trigger validation for the new value field
		void trigger(`origin.${index}.${next}`)
	}

	return {
		typeField,
		emailField,
		phoneField,
		otherField,
		currentValueField,
		errorId,
		error,
		handleType
	}
}