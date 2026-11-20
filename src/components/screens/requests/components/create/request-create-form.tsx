"use client"

import type { BaseSyntheticEvent, FC } from "react"

import { REQUEST_CREATE_FORM_ID } from "@/libs/constants/screens/requests/request-form"

import { RequestFormFields } from "../form/request-form-fields"

import { RequestDraftNotice } from "./request-draft-notice"

interface Props {
	isDraftRestored: boolean
	onSubmit: (event?: BaseSyntheticEvent) => Promise<void>
	onDismissDraftNotice: () => void
}

export const RequestCreateForm: FC<Props> = ({
	isDraftRestored,
	onSubmit,
	onDismissDraftNotice
}) => (
	<form
		id={REQUEST_CREATE_FORM_ID}
		onSubmit={onSubmit}
		noValidate
		className="min-w-0"
	>
		<RequestDraftNotice
			visible={isDraftRestored}
			onDismiss={onDismissDraftNotice}
		/>

		<RequestFormFields />
	</form>
)
