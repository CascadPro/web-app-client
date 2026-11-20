import { useCallback, useId, useMemo } from "react"
import { useController, useFormContext } from "react-hook-form"

import { CreateRequestFormFields } from "@/libs/schemes"
import { getTodayISO } from "@/libs/utils/screens/request-create"

import { useInlinePanel } from "./useInlinePanel"

const CLOSE_DELAY = 180

export const useRequestDeadline = (minDate: string | undefined) => {
	const id = useId()
	const labelId = `${id}-label`
	const valueId = `${id}-value`
	const panelId = `${id}-panel`
	const messageId = `${id}-message`

	const { control, formState } = useFormContext<CreateRequestFormFields>()
	const { field } = useController({ control, name: "deadline" })

	const panel = useInlinePanel({ onClose: field.onBlur })

	const today = useMemo(getTodayISO, [])
	const min = minDate ?? today
	const value = field.value
	const error = formState.errors.deadline?.message

	const { closeAfter, triggerRef } = panel

	const handleSelect = useCallback(
		(iso: string) => {
			field.onChange(iso)
			closeAfter(CLOSE_DELAY)
		},
		[field, closeAfter]
	)

	const handleClear = useCallback(() => {
		field.onChange("")
		triggerRef.current?.focus()
	}, [field, triggerRef])

	return {
		labelId,
		valueId,
		panelId,
		messageId,
		panel,
		min,
		value,
		error,
		handleSelect,
		handleClear
	}
}
