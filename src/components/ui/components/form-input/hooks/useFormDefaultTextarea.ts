import type { InputEvent } from "react"

import { onInputRuleWithSpaces } from "@/libs/utils"

import type { FormInputFieldNames } from "../types/form-input.type"

import { useFormInput } from "./useFormInput"

export const useFormDefaultTextarea = (name: FormInputFieldNames) => {
	const { clearErrors, error, setValue, register, value } = useFormInput(name)

	const clear = () => setValue(name, "", { shouldValidate: true })

	const onInput = (e: InputEvent<HTMLTextAreaElement>) =>
		onInputRuleWithSpaces(e.currentTarget)

	const clearError = () => {
		if (error) clearErrors(name)
	}

	return {
		onInput,
		clear,
		clearError,
		register,
		value
	}
}
