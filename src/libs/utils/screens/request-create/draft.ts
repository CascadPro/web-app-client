import { del, get, set } from "idb-keyval"

import {
	REQUEST_DRAFT_KEY,
	REQUEST_DRAFT_TTL
} from "@/libs/constants/screens/request-form"
import {
	createRequestDefaults,
	type CreateRequestFormFields,
	requestDraftScheme
} from "@/libs/schemes"

interface StoredDraft {
	values: unknown
	savedAt: number
}

const isEmptyDraft = (values: CreateRequestFormFields): boolean =>
	!values.title.trim() &&
	!values.deadline &&
	values.origin.every(item => !item.value.trim()) &&
	values.work_types.length === 0 &&
	values.geography.length === 0

export const clearRequestDraft = async (): Promise<void> => {
	try {
		await del(REQUEST_DRAFT_KEY)
	} catch {
		// IndexedDB может быть недоступен (приватный режим) — черновик не критичен
	}
}

export const saveRequestDraft = async (
	values: CreateRequestFormFields
): Promise<void> => {
	try {
		if (isEmptyDraft(values)) {
			await del(REQUEST_DRAFT_KEY)
			return
		}

		const draft: StoredDraft = { values, savedAt: Date.now() }

		await set(REQUEST_DRAFT_KEY, draft)
	} catch {
		// см. выше
	}
}

export const loadRequestDraft =
	async (): Promise<CreateRequestFormFields | null> => {
		try {
			const stored = await get<StoredDraft>(REQUEST_DRAFT_KEY)

			if (!stored) return null

			if (Date.now() - stored.savedAt > REQUEST_DRAFT_TTL) {
				await del(REQUEST_DRAFT_KEY)
				return null
			}

			const parsed = requestDraftScheme.safeParse(stored.values)

			if (!parsed.success) {
				await del(REQUEST_DRAFT_KEY)
				return null
			}

			return { ...createRequestDefaults, ...parsed.data }
		} catch {
			return null
		}
	}
