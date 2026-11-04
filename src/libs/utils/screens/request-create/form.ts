import type { RequestHttpDtoCreateRequestRequest } from "@/api/generated"
import {
	REQUEST_FORM_LIMITS,
	REQUEST_TAG_HINTS
} from "@/libs/constants/screens/request-form"
import type { CreateRequestFormFields } from "@/libs/schemes"

import { toDeadlineISO } from "./date"

/** Форма → тело запроса: пустые значения не отправляем */
export const toCreateRequestPayload = (
	values: CreateRequestFormFields
): RequestHttpDtoCreateRequestRequest => {
	const origin = values.origin
		.map(item => ({ type: item.type, value: item.value.trim() }))
		.filter(item => item.value.length > 0)

	return {
		title: values.title.trim(),
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

/** Добавляет теги без дублей (без учёта регистра) с учётом лимитов */
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
