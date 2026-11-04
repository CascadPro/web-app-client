"use client"

import type { FC } from "react"

import { FormInput } from "@/components/ui/components/form-input"
import { REQUEST_FORM_LIMITS } from "@/libs/constants/screens/request-form"

import { RequestDeadlineField } from "./fields/request-deadline-field"
import { RequestOriginFields } from "./fields/request-origin-fields"
import { RequestTagsField } from "./fields/request-tags-field"

interface Props {
	/** См. RequestDeadlineField */
	deadlineMin?: string
	deadlineClearable?: boolean
}

/**
 * Поля заявки — общие для создания и редактирования.
 * Рендерятся внутри FormProvider, <form> и кнопки действий — снаружи.
 */
export const RequestFormFields: FC<Props> = ({
	deadlineMin,
	deadlineClearable
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
		/>

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
