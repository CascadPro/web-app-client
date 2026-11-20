import type {
	DomainRequestOriginType,
	RequestsTransportHttpGetRequestResponse,
	RequestsTransportHttpPatchRequestRequest,
	RequestHttpDtoGetRequestsResponseOrigin
} from "@/api/generated"
import type { CreateRequestFormFields } from "@/libs/schemes"

import { formatRuPhone, normalizeOriginValue } from "../../phone"
import { toDeadlineISO } from "../request-create/date"
import { deadlineToDateInput } from "../request-details/deadline"

type OriginType = CreateRequestFormFields["origin"][number]["type"]

const isOriginType = (value: unknown): value is OriginType =>
	value === "email" || value === "phone" || value === "other"

const toFormOrigin = (
	originItem: RequestHttpDtoGetRequestsResponseOrigin
): CreateRequestFormFields["origin"][number] => {
	if (originItem.email) {
		return { type: "email", email: normalizeOriginValue("email", originItem.email) }
	}
	if (originItem.phone) {
		const formatted = formatRuPhone(originItem.phone)
		return formatted
			? { type: "phone", phone: formatted }
			: { type: "other", other: originItem.phone }
	}
	if (originItem.other) {
		return { type: "other", other: originItem.other }
	}

	const value = ""
	if (originItem.type === "phone") {
		const formatted = formatRuPhone(value)
		return formatted
			? { type: "phone", phone: formatted }
			: { type: "other", other: value }
	}

	return { type: isOriginType(originItem.type) ? originItem.type : "other", [originItem.type === "email" ? "email" : "other"]: value }
}

export const requestToFormValues = (
	request: Pick<
		RequestsTransportHttpGetRequestResponse,
		| "title"
		| "deadline"
		| "client"
		| "origin"
		| "work_types"
		| "geography_description"
	>
): CreateRequestFormFields => ({
	title: request.title ?? "",
	deadline: deadlineToDateInput(request.deadline),
	client_id: request.client?.id ?? "",
	origin: (request.origin ?? [])
		.filter(item => item.email || item.phone || item.other)
		.map(item => toFormOrigin(item)),
	work_types: [...(request.work_types ?? [])],
	geography: [...(request.geography_description ?? [])]
})

const sameList = (a: string[], b: string[]): boolean =>
	a.length === b.length && a.every((item, index) => item === b[index])

type NormalizedOriginItem =
	| { type: "email"; email: string }
	| { type: "phone"; phone: string }
	| { type: "other"; other: string }

const normalizeOrigin = (list: CreateRequestFormFields["origin"]): NormalizedOriginItem[] =>
	list
		.map(item => {
			switch (item.type) {
				case "email":
					return item.email ? { type: "email" as const, email: normalizeOriginValue(item.type, item.email) } : null
				case "phone":
					return item.phone ? { type: "phone" as const, phone: normalizeOriginValue(item.type, item.phone) } : null
				case "other":
					return item.other ? { type: "other" as const, other: item.other } : null
				default:
					return null
			}
		})
		.filter((item): item is NormalizedOriginItem => item !== null)

const sameOrigin = (
	a: CreateRequestFormFields["origin"],
	b: CreateRequestFormFields["origin"]
): boolean => {
	const left = normalizeOrigin(a)
	const right = normalizeOrigin(b)

	return (
		left.length === right.length &&
		left.every((item, index) => {
			const rightItem = right[index]
			if (item.type !== rightItem?.type) return false

			switch (item.type) {
				case "email":
					return item.email === (rightItem as { type: "email"; email: string }).email
				case "phone":
					return item.phone === (rightItem as { type: "phone"; phone: string }).phone
				case "other":
					return item.other === (rightItem as { type: "other"; other: string }).other
			}
		})
	)
}

interface PatchRequestOrigin {
	type?: DomainRequestOriginType
	email?: string
	phone?: string
	other?: string
}

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

	if (values.client_id && values.client_id !== initial.client_id) {
		body.client_id = values.client_id
	}

	if (!sameOrigin(initial.origin, values.origin)) {
		body.origin = normalizeOrigin(values.origin) as unknown as PatchRequestOrigin[]
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