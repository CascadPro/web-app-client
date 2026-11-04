import type {
	RequestsTransportHttpGetRequestResponse,
	RequestsTransportHttpPatchRequestRequest
} from "@/api/generated"
import type { CreateRequestFormFields } from "@/libs/schemes"

import { toDeadlineISO } from "../request-create/date"
import { deadlineToDateInput } from "../request-details/deadline"

type OriginType = CreateRequestFormFields["origin"][number]["type"]

const isOriginType = (value: unknown): value is OriginType =>
	value === "email" || value === "phone" || value === "other"

/** Детальная заявка → значения формы (форма создания и редактирования общая) */
export const requestToFormValues = (
	request: Pick<
		RequestsTransportHttpGetRequestResponse,
		"title" | "deadline" | "origin" | "work_types" | "geography_description"
	>
): CreateRequestFormFields => ({
	title: request.title ?? "",
	deadline: deadlineToDateInput(request.deadline),
	origin: (request.origin ?? [])
		.filter(item => item.value)
		.map(item => ({
			type: isOriginType(item.type) ? item.type : "other",
			value: item.value ?? ""
		})),
	work_types: [...(request.work_types ?? [])],
	// В ответе «география» приходит как geography_description
	geography: [...(request.geography_description ?? [])]
})

const sameList = (a: string[], b: string[]): boolean =>
	a.length === b.length && a.every((item, index) => item === b[index])

const normalizeOrigin = (list: CreateRequestFormFields["origin"]) =>
	list
		.map(item => ({ type: item.type, value: item.value.trim() }))
		.filter(item => item.value)

const sameOrigin = (
	a: CreateRequestFormFields["origin"],
	b: CreateRequestFormFields["origin"]
): boolean => {
	const left = normalizeOrigin(a)
	const right = normalizeOrigin(b)

	return (
		left.length === right.length &&
		left.every(
			(item, index) =>
				item.type === right[index]?.type && item.value === right[index]?.value
		)
	)
}

/**
 * PATCH только с изменёнными полями. Срок нельзя «стереть»:
 * пустое значение игнорируется (форма не даёт его очистить).
 */
export const buildPatchPayload = (
	initial: CreateRequestFormFields,
	values: CreateRequestFormFields
): RequestsTransportHttpPatchRequestRequest => {
	const body: RequestsTransportHttpPatchRequestRequest = {}

	const title = values.title.trim()

	if (title !== initial.title.trim()) body.title = title

	if (values.deadline && values.deadline !== initial.deadline) {
		body.deadline = toDeadlineISO(values.deadline)
	}

	if (!sameOrigin(initial.origin, values.origin)) {
		body.origin = normalizeOrigin(values.origin)
	}

	if (!sameList(initial.work_types, values.work_types)) {
		body.work_types = values.work_types
	}

	if (!sameList(initial.geography, values.geography)) {
		body.geography = values.geography
	}

	return body
}

export const hasPatchChanges = (
	body: RequestsTransportHttpPatchRequestRequest
): boolean => Object.keys(body).length > 0
