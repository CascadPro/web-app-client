import { del, get, set } from "idb-keyval"

import type { RequestHttpDtoCreateRequestRequest } from "@/api/generated"
import {
	REQUEST_OFFLINE_QUEUE_KEY,
	REQUEST_OFFLINE_QUEUE_MAX
} from "@/libs/constants/screens/requests/request-form"

import { errorCatch } from "../../error-catch"

export interface QueuedRequest {
	key: string
	body: RequestHttpDtoCreateRequestRequest
	createdAt: number
}

export interface FlushRequestsResult {
	sent: number
	failed: number
}

let lock: Promise<unknown> = Promise.resolve()

const withLock = <T>(task: () => Promise<T>): Promise<T> => {
	const next = lock.then(task).catch(error => {
		lock = Promise.resolve()
		throw error
	})

	lock = next.catch(() => {})

	return next
}

const read = async (): Promise<QueuedRequest[]> =>
	(await get<QueuedRequest[]>(REQUEST_OFFLINE_QUEUE_KEY)) ?? []

const write = async (items: QueuedRequest[]): Promise<void> => {
	if (items.length === 0) {
		await del(REQUEST_OFFLINE_QUEUE_KEY)
		return
	}

	await set(REQUEST_OFFLINE_QUEUE_KEY, items)
}

export const isOffline = (): boolean =>
	typeof navigator !== "undefined" && !navigator.onLine

export const enqueueRequest = (item: QueuedRequest): Promise<void> =>
	withLock(async () => {
		const items = await read()

		if (items.some(queued => queued.key === item.key)) return

		await write([...items, item].slice(-REQUEST_OFFLINE_QUEUE_MAX))
	})

const removeQueuedRequest = (key: string): Promise<void> =>
	withLock(async () => {
		const items = await read()

		await write(items.filter(item => item.key !== key))
	})

const isRetryable = (error: unknown): boolean => {
	const { status } = errorCatch(error)

	return status >= 500 || status === 429
}

let flushing: Promise<FlushRequestsResult> | null = null

export const flushRequestQueue = (
	send: (item: QueuedRequest) => Promise<unknown>
): Promise<FlushRequestsResult> => {
	if (flushing) return flushing

	flushing = (async () => {
		const result: FlushRequestsResult = { sent: 0, failed: 0 }

		const items = await withLock(read)

		for (const item of items) {
			if (isOffline()) break

			try {
				await send(item)
				await removeQueuedRequest(item.key)

				result.sent += 1
			} catch (error) {
				if (isRetryable(error)) break

				await removeQueuedRequest(item.key)

				result.failed += 1
			}
		}

		return result
	})().finally(() => {
		flushing = null
	})

	return flushing
}
