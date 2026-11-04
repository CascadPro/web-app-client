"use client"

import type { BaseSyntheticEvent, FC } from "react"

import { REQUEST_EDIT_FORM_ID } from "@/libs/constants/screens/request-form"

import { RequestFormFields } from "../form/request-form-fields"

interface Props {
	onSubmit: (event?: BaseSyntheticEvent) => Promise<void>
	deadlineMin?: string
	deadlineClearable: boolean
}

export const RequestEditForm: FC<Props> = ({
	onSubmit,
	deadlineMin,
	deadlineClearable
}) => (
	<form
		id={REQUEST_EDIT_FORM_ID}
		onSubmit={onSubmit}
		noValidate
		className="min-w-0"
	>
		<RequestFormFields
			deadlineMin={deadlineMin}
			deadlineClearable={deadlineClearable}
		/>
	</form>
)
