"use client"

import type { FC } from "react"

import { FormInput } from "@/components/ui/components/form-input"
import { REQUEST_FORM_LIMITS } from "@/libs/constants/screens/requests/request-form"
import { onInputRuleWithSpaces } from "@/libs/utils"

import { RequestClientField } from "./fields/request-client-field"
import { RequestDeadlineField } from "./fields/request-deadline-field"
import { RequestOriginFields } from "./fields/request-origin-fields"
import { RequestTagsField } from "./fields/request-tags-field"

interface Props {
	deadlineMin?: string
	deadlineClearable?: boolean
	clientClearable?: boolean
}

export const RequestFormFields: FC<Props> = ({
	deadlineMin,
	deadlineClearable,
	clientClearable
}) => (
	<div className="flex flex-col gap-9 pt-6">
		<FormInput
			type="text"
			name="title"
			label="Название"
			placeholder="Например, ремонт офиса"
			maxLength={REQUEST_FORM_LIMITS.TITLE_MAX}
			autoComplete="off"
			enterKeyHint="next"
			required
			onInput={e => onInputRuleWithSpaces(e.currentTarget)}
		/>

		<RequestClientField clearable={clientClearable} />

		<RequestDeadlineField minDate={deadlineMin} clearable={deadlineClearable} />

		<RequestOriginFields />

		<RequestTagsField
			name="work_types"
			label="Виды работ"
			placeholder="Например, электрика"
		/>

		<RequestTagsField
			name="geography"
			label="География"
			placeholder="Например, Москва"
		/>
	</div>
)
