import {
	clear,
	createStore,
	delMany,
	getMany,
	keys,
	setMany,
	type UseStore
} from "idb-keyval"

import {
	canStoreOffline,
	isOfflineCopyValid,
	OFFLINE_LIMITS,
	type OfflineLimits,
	planEviction
} from "@/libs/utils/screens/request-details/offline-policy"

/**
 * Файлы на устройстве (IndexedDB). Для каждого файла две записи:
 * meta:{id} — лёгкое описание (читается списком), blob:{id} — сам файл.
 * Идентификатор файла меняется при замене, поэтому устаревших копий не бывает.
 */

export interface OfflineFileMeta {
	id: string
	name: string
	type: string
	size: number
	savedAt: number
	lastUsedAt: number
}

export interface OfflineFileEntry {
	id: string
	blob: Blob
	name: string
	type: string
}

const META = "meta:"
const BLOB = "blob:"

const metaKey = (id: string) => `${META}${id}`
const blobKey = (id: string) => `${BLOB}${id}`

// createStore сразу открывает базу, поэтому создаём лениво — только в браузере
let store: UseStore | null = null

const getStore = (): UseStore =>
	(store ??= createStore("cascade-offline-files", "files"))

const isSupported = (): boolean => typeof indexedDB !== "undefined"

/** Лимиты с оглядкой на квоту браузера: занимаем не больше половины */
const getLimits = async (): Promise<OfflineLimits> => {
	try {
		const estimate = await navigator.storage?.estimate?.()

		if (estimate?.quota) {
			const cap = Math.floor(estimate.quota * 0.5)

			return {
				...OFFLINE_LIMITS,
				maxBytes: Math.min(OFFLINE_LIMITS.maxBytes, cap),
				maxFileBytes: Math.min(OFFLINE_LIMITS.maxFileBytes, cap)
			}
		}
	} catch {
		// оценка недоступна — берём обычные лимиты
	}

	return OFFLINE_LIMITS
}

let persistRequested = false

/** Просим браузер не вычищать данные без нашего ведома (где это поддерживается) */
const requestPersistentStorage = async (): Promise<void> => {
	if (persistRequested) return

	persistRequested = true

	try {
		await navigator.storage?.persist?.()
	} catch {
		// не критично
	}
}

export const listOfflineMeta = async (): Promise<OfflineFileMeta[]> => {
	if (!isSupported()) return []

	try {
		const all = await keys<string>(getStore())
		const metaKeys = all.filter(
			key => typeof key === "string" && key.startsWith(META)
		)

		const metas = await getMany<OfflineFileMeta | undefined>(
			metaKeys,
			getStore()
		)

		return metas.filter((meta): meta is OfflineFileMeta => Boolean(meta))
	} catch {
		return []
	}
}

export const removeOfflineFile = async (id: string): Promise<void> => {
	if (!isSupported()) return

	try {
		await delMany([metaKey(id), blobKey(id)], getStore())
	} catch {
		// не критично: копию вытеснит лимит
	}
}

export const clearOfflineFiles = async (): Promise<void> => {
	if (!isSupported()) return

	try {
		await clear(getStore())
	} catch {
		// см. выше
	}
}

/**
 * Читает файл с устройства. Битую или не совпавшую по размеру копию удаляет
 * и возвращает null — тогда файл просто скачается заново.
 */
export const readOfflineFile = async (
	id: string,
	expectedSize?: number | null
): Promise<{ blob: Blob; meta: OfflineFileMeta } | null> => {
	if (!isSupported()) return null

	try {
		const [meta, blob] = await getMany<OfflineFileMeta | Blob | undefined>(
			[metaKey(id), blobKey(id)],
			getStore()
		)

		if (!meta || !(blob instanceof Blob)) {
			if (meta || blob) await removeOfflineFile(id)

			return null
		}

		const info = meta as OfflineFileMeta

		if (!isOfflineCopyValid(blob.size, expectedSize)) {
			await removeOfflineFile(id)

			return null
		}

		// Отмечаем использование: недавно открытые файлы вытесняются последними
		void setMany(
			[[metaKey(id), { ...info, lastUsedAt: Date.now() }]],
			getStore()
		).catch(() => {})

		return { blob, meta: info }
	} catch {
		return null
	}
}

/**
 * Сохраняет файл, при необходимости вытесняя давно не открывавшиеся.
 * false — не сохранили (слишком большой, нет места, хранилище недоступно);
 * на устройство файл при этом всё равно уже скачан, это лишь «копия про запас».
 */
export const writeOfflineFile = async (
	entry: OfflineFileEntry
): Promise<boolean> => {
	if (!isSupported()) return false

	const limits = await getLimits()

	if (!canStoreOffline(entry.blob.size, limits)) return false

	try {
		const now = Date.now()

		const existing = (await listOfflineMeta()).filter(
			meta => meta.id !== entry.id
		)

		const evict = planEviction(
			[...existing, { id: entry.id, size: entry.blob.size, lastUsedAt: now }],
			limits,
			entry.id
		)

		if (evict.length > 0) {
			await delMany(
				evict.flatMap(id => [metaKey(id), blobKey(id)]),
				getStore()
			)
		}

		const meta: OfflineFileMeta = {
			id: entry.id,
			name: entry.name,
			type: entry.type,
			size: entry.blob.size,
			savedAt: now,
			lastUsedAt: now
		}

		await setMany(
			[
				[metaKey(entry.id), meta],
				[blobKey(entry.id), entry.blob]
			],
			getStore()
		)

		void requestPersistentStorage()

		return true
	} catch {
		return false
	}
}
