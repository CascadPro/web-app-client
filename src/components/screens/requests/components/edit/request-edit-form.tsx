"use client"

import type { BaseSyntheticEvent, FC } from "react"

import { REQUEST_EDIT_FORM_ID } from "@/libs/constants/screens/requests/request-form"

import { RequestFormFields } from "../form/request-form-fields"

interface Props {
	onSubmit: (event?: BaseSyntheticEvent) => Promise<void>
	deadlineMin?: string
	deadlineClearable: boolean
	clientClearable: boolean
}

export const RequestEditForm: FC<Props> = ({
	onSubmit,
	deadlineMin,
	deadlineClearable,
	clientClearable
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
			clientClearable={clientClearable}
		/>
	</form>
)
