import { dehydrate, type QueryClient } from "@tanstack/react-query"

import type { CacheSize, CacheStats } from "@/types/cache"

const encoder = new TextEncoder()

function formatBytes(bytes: number): string {
	if (bytes < 1024) return `${bytes} B`

	const units = ["KB", "MB", "GB", "TB"]
	let size = bytes / 1024
	let unit = 0

	while (size >= 1024 && unit < units.length - 1) {
		size /= 1024
		unit++
	}

	return `${size.toFixed(2)} ${units[unit]}`
}

function makeSize(bytes: number): CacheSize {
	return { bytes, formatted: formatBytes(bytes) }
}

function measureWebStorage(storage: Storage): number {
	let bytes = 0

	for (let i = 0; i < storage.length; i++) {
		const key = storage.key(i)

		if (key === null) continue

		const value = storage.getItem(key) ?? ""
		bytes += encoder.encode(key).byteLength
		bytes += encoder.encode(value).byteLength
	}

	return bytes
}

async function measureCacheStorage(): Promise<number> {
	if (!("caches" in window)) return 0

	let bytes = 0

	for (const cacheName of await caches.keys()) {
		const cache = await caches.open(cacheName)
		const requests = await cache.keys()

		for (const request of requests) {
			const response = await cache.match(request)

			if (!response) continue

			// Учитываем заголовки и тело ответа.
			bytes += encoder.encode(request.url).byteLength

			for (const [key, value] of response.headers.entries()) {
				bytes += encoder.encode(key).byteLength
				bytes += encoder.encode(value).byteLength
			}

			try {
				const body = await response.clone().arrayBuffer()
				bytes += body.byteLength
			} catch {
				// Некоторые ответы браузер не позволяет прочитать.
			}
		}
	}

	return bytes
}

export async function getCacheStats(
	queryClient: QueryClient
): Promise<CacheStats> {
	// Это размер JSON-представления кэша, а не реальной памяти JS.
	const dehydrated = dehydrate(queryClient)
	const queryClientBytes = encoder.encode(JSON.stringify(dehydrated)).byteLength

	const localStorageBytes = measureWebStorage(window.localStorage)
	const sessionStorageBytes = measureWebStorage(window.sessionStorage)
	const cacheStorageBytes = await measureCacheStorage()

	let usage = 0
	let quota = 0

	if (navigator.storage?.estimate) {
		const estimate = await navigator.storage.estimate()
		usage = estimate.usage ?? 0
		quota = estimate.quota ?? 0
	}

	// Сумма измеренных категорий. Возможны дублирования данных.
	const totalMeasured =
		queryClientBytes +
		localStorageBytes +
		sessionStorageBytes +
		cacheStorageBytes

	return {
		queryClient: makeSize(queryClientBytes),
		localStorage: makeSize(localStorageBytes),
		sessionStorage: makeSize(sessionStorageBytes),
		cacheStorage: makeSize(cacheStorageBytes),
		browserStorage: {
			usage: makeSize(usage),
			quota: makeSize(quota)
		},
		totalMeasured: makeSize(totalMeasured)
	}
}
