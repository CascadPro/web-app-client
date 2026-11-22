import type { FactoryArg } from "imask"
import type InputMask from "imask/esm/controls/input"
import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react"

import type {
	CreateRequestFormFields,
	LoginFormFields,
	RegisterFormFields
} from "@/libs/schemes"
import type { ReactStateHook } from "@/types/base"

type FormInputSetMask = ReactStateHook<InputMask<FactoryArg> | undefined>

export type FormInputFieldNames =
	| keyof LoginFormFields
	| keyof RegisterFormFields
	| keyof CreateRequestFormFields
	| (string & {})

export type FormInputType = "default" | "textarea" | "phone"

export interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
	name: FormInputFieldNames
	label?: string
	isLoading?: boolean
	containerClassName?: string
	clearBtnClassName?: string
	errorClassName?: string
	caretClassName?: string
	setMask?: FormInputSetMask
	align?: "center" | "start" | "end"
	textareaProps?: TextareaHTMLAttributes<HTMLTextAreaElement> & {
		counter?: boolean
	}
	/** Явное указание типа поля (переопределяет автоопределение по имени) */
	variant?: FormInputType
}

export interface FormDefaultInputProps extends InputHTMLAttributes<HTMLInputElement> {
	name: FormInputFieldNames
	label?: string
	clearBtnClassName?: string
	setMask?: FormInputSetMask
	isLoading?: boolean
	/** id сообщения об ошибке — для aria-describedby */
	errorId?: string
}

export interface FormDefaultTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
	name: FormInputFieldNames
	counter?: boolean
	label?: string
	clearBtnClassName?: string
	isLoading?: boolean
	/** id сообщения об ошибке — для aria-describedby */
	errorId?: string
}
