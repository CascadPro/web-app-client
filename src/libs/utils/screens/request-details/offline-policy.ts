/**
 * Правила офлайн-хранилища файлов (чистая логика, без IndexedDB).
 * Хранилище ограничено по объёму и количеству, лишнее вытесняется — сначала то,
 * чем давно не пользовались.
 */

export interface OfflineLimits {
	/** Всего на устройстве */
	maxBytes: number
	maxFiles: number
	/** Один файл больше этого размера не сохраняем */
	maxFileBytes: number
}

export const OFFLINE_LIMITS: OfflineLimits = {
	maxBytes: 250 * 1024 * 1024,
	maxFiles: 60,
	maxFileBytes: 100 * 1024 * 1024
}

export interface OfflineEntryInfo {
	id: string
	size: number
	lastUsedAt: number
}

/** Можно ли вообще сохранять файл такого размера */
export const canStoreOffline = (size: number, limits: OfflineLimits): boolean =>
	Number.isFinite(size) &&
	size > 0 &&
	size <= limits.maxFileBytes &&
	size <= limits.maxBytes

/**
 * Какие файлы удалить, чтобы уложиться в лимиты (LRU).
 * `keepId` — только что сохранённый файл: его не трогаем.
 */
export const planEviction = (
	entries: OfflineEntryInfo[],
	limits: OfflineLimits,
	keepId?: string
): string[] => {
	let bytes = entries.reduce((sum, entry) => sum + entry.size, 0)
	let count = entries.length

	const evict: string[] = []

	const oldestFirst = [...entries].sort((a, b) => a.lastUsedAt - b.lastUsedAt)

	for (const entry of oldestFirst) {
		if (bytes <= limits.maxBytes && count <= limits.maxFiles) break

		if (entry.id === keepId) continue

		evict.push(entry.id)
		bytes -= entry.size
		count -= 1
	}

	return evict
}

/**
 * Сохранённая копия годится, если размер совпадает с тем, что сообщает API.
 * Если API размер не назвал — доверяем копии.
 */
export const isOfflineCopyValid = (
	storedSize: number,
	expectedSize?: number | null
): boolean => !expectedSize || storedSize === expectedSize
