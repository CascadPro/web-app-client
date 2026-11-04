import type { FieldPath, UseFormReturn } from "react-hook-form"

import type { CreateRequestFormFields } from "@/libs/schemes"

const FORM_FIELDS = [
	"title",
	"deadline",
	"origin",
	"work_types",
	"geography"
] as const

/** Ошибки валидации с бэкенда → под соответствующие поля формы */
export const applyServerFieldErrors = (
	form: UseFormReturn<CreateRequestFormFields>,
	fields: Record<string, string>
): void => {
	for (const [name, message] of Object.entries(fields)) {
		if (!(FORM_FIELDS as readonly string[]).includes(name)) continue

		form.setError(name as FieldPath<CreateRequestFormFields>, {
			type: "server",
			message
		})
	}
}
