import IMask, { FactoryArg } from "imask"
import type InputMask from "imask/esm/controls/input"
import { InputEvent, useEffect, useState } from "react"

import { PHONE_MASK_PATTERN } from "@/libs/constants"
import { onInputRule } from "@/libs/utils"
import { ReactStateHook } from "@/types/base"

import type { FormInputFieldNames } from "../types/form-input.type"

import { useFormInput } from "./useFormInput"

export const useFormDefaultInput = (
	name: FormInputFieldNames,
	setMask?: ReactStateHook<InputMask<FactoryArg> | undefined>
) => {
	const { input, clearErrors, error, setValue, getValues, register, value } =
		useFormInput(name)

	const isPassword = name === "password"
	const isPhone = false // TODO: if phone will appear

	let mask: InputMask<FactoryArg>

	const [isShowPassword, setIsShowPassword] = useState<boolean>(false)

	useEffect(() => {
		if (input.type && isPhone) {
			mask = IMask<FactoryArg>(input, {
				mask: PHONE_MASK_PATTERN,
				lazy: true
			})

			setMask?.(mask)
		} else return
	}, [input])

	const clear = () => setValue(name, "", { shouldValidate: true })

	const onInput = (e: InputEvent<HTMLInputElement>) => {
		if (!isPhone) onInputRule(e.currentTarget)
		else if (!input.value) setValue(name, "", { shouldValidate: true })
		else if (input.value.includes("+7 (") && !getValues(name))
			setValue(name, input.value, { shouldValidate: true })
	}

	const clearError = () => {
		if (error) clearErrors(name)
	}

	const showPassword = () => setIsShowPassword(prev => !prev)

	return {
		onInput,
		isPassword,
		isShowPassword,
		showPassword,
		clear,
		clearError,
		register,
		value
	}
}
