import type { RequestHttpDtoGetRequestResponseDocs } from "@/api/generated"

export type RequestDocKey = keyof RequestHttpDtoGetRequestResponseDocs

export interface RequestDocSlot {
	key: RequestDocKey
	label: string
	/** Индекс слота в POST/DELETE /requests/{id}/file/{index} (так он устроен на сервере) */
	index: number
}

/**
 * Четыре слота документов в порядке показа.
 * Индексы заданы сервером: 0 — проект, 1 — техзадание, 2 — спецификация, 3 — договор.
 */
export const REQUEST_DOC_SLOTS: RequestDocSlot[] = [
	{ key: "contract", label: "Договор", index: 3 },
	{ key: "project", label: "Проект", index: 0 },
	{ key: "specification", label: "Спецификация", index: 2 },
	{ key: "tech_task", label: "Техническое задание", index: 1 }
]
