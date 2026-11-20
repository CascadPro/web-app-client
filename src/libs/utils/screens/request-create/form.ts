import type {
	RequestHttpDtoCreateRequestRequest,
	RequestHttpDtoCreateRequestRequestOrigin
} from "@/api/generated"
import {
	REQUEST_FORM_LIMITS,
	REQUEST_TAG_HINTS
} from "@/libs/constants/screens/requests/request-form"
import type { CreateRequestFormFields } from "@/libs/schemes"

import { normalizeOriginValue } from "../../phone"

import { toDeadlineISO } from "./date"

type OriginItemWithEmail = RequestHttpDtoCreateRequestRequestOrigin & {
	type: "email"
	email: string
}
type OriginItemWithPhone = RequestHttpDtoCreateRequestRequestOrigin & {
	type: "phone"
	phone: string
}
type OriginItemWithOther = RequestHttpDtoCreateRequestRequestOrigin & {
	type: "other"
	other: string
}

function isOriginItemWithEmail(
	item: RequestHttpDtoCreateRequestRequestOrigin
): item is OriginItemWithEmail {
	return item.type === "email" && !!item.email
}

function isOriginItemWithPhone(
	item: RequestHttpDtoCreateRequestRequestOrigin
): item is OriginItemWithPhone {
	return item.type === "phone" && !!item.phone
}

function isOriginItemWithOther(
	item: RequestHttpDtoCreateRequestRequestOrigin
): item is OriginItemWithOther {
	return item.type === "other" && !!item.other
}

export const toCreateRequestPayload = (
	values: CreateRequestFormFields
): RequestHttpDtoCreateRequestRequest => {
	const origin = values.origin
		.map(item => {
			const base = { type: item.type }
			switch (item.type) {
				case "email":
					return {
						...base,
						email: item.email
							? normalizeOriginValue(item.type, item.email)
							: undefined
					}
				case "phone":
					return {
						...base,
						phone: item.phone
							? normalizeOriginValue(item.type, item.phone)
							: undefined
					}
				case "other":
					return { ...base, other: item.other }
				default:
					return base
			}
		})
		.filter(
			(
				item
			): item is
				OriginItemWithEmail | OriginItemWithPhone | OriginItemWithOther => {
				if (item.type === "email") return isOriginItemWithEmail(item)
				if (item.type === "phone") return isOriginItemWithPhone(item)
				if (item.type === "other") return isOriginItemWithOther(item)
				return false
			}
		)

	return {
		title: values.title.trim(),
		...(values.client_id ? { client_id: values.client_id } : {}),
		...(values.deadline ? { deadline: toDeadlineISO(values.deadline) } : {}),
		...(origin.length > 0 ? { origin } : {}),
		...(values.work_types.length > 0 ? { work_types: values.work_types } : {}),
		...(values.geography.length > 0 ? { geography: values.geography } : {})
	}
}

export const splitTags = (raw: string): string[] => raw.split(/[,;\n]+/)

export const normalizeTag = (raw: string): string =>
	raw.replace(/\s+/g, " ").trim()

export type TagSkipReason = keyof typeof REQUEST_TAG_HINTS

export interface MergeTagsResult {
	tags: string[]
	skipped: TagSkipReason | null
}

export const mergeTags = (
	current: string[],
	incoming: string[]
): MergeTagsResult => {
	const tags = [...current]
	const seen = new Set(tags.map(tag => tag.toLowerCase()))

	let skipped: TagSkipReason | null = null

	for (const raw of incoming) {
		const tag = normalizeTag(raw)

		if (!tag) continue

		if (tag.length > REQUEST_FORM_LIMITS.TAG_MAX_LENGTH) {
			skipped = "length"
			continue
		}

		if (seen.has(tag.toLowerCase())) {
			skipped ??= "duplicate"
			continue
		}

		if (tags.length >= REQUEST_FORM_LIMITS.TAGS_MAX_ITEMS) {
			skipped = "limit"
			break
		}

		seen.add(tag.toLowerCase())
		tags.push(tag)
	}

	return { tags, skipped }
}
