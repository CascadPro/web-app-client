import { useFormContext } from "react-hook-form"

import type {
	FormInputFieldNames,
	FormInputType
} from "../types/form-input.type"

export const useFormInput = (name: FormInputFieldNames) => {
	const {
		register,
		formState,
		watch,
		setValue,
		control,
		clearErrors,
		getValues
	} = useFormContext()
	const value = watch(name)
	const error = formState.errors[name]?.message || ""
	const field = control._fields[name]?._f
	const input =
		field && "ref" in field ? (field?.ref as HTMLInputElement) : undefined

	const inputType = (): FormInputType => {
		switch (name) {
			case "phone":
				return "phone"
			default:
				return "default"
		}
	}

	return {
		register,
		value,
		error,
		input,
		clearErrors,
		setValue,
		getValues,
		input_type: inputType()
	}
}