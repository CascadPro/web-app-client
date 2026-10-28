import { del, get, set } from "idb-keyval"

import {
	getUserSettings,
	patchUserSettings,
	type PatchUserSettingsRequest,
	type UserSettingsResponse
} from "@/api/settings"

import { errorCatch } from "../../error-catch"

const QUEUE_KEY = "cascade:user-settings:offline-queue:v1"

type SettingsChanges = Omit<PatchUserSettingsRequest, "version">

let flushPromise: Promise<UserSettingsResponse | null> | null = null

const mergeChanges = (
	left: SettingsChanges | undefined,
	right: SettingsChanges
): SettingsChanges => ({
	...left,
	...right,
	preferences: {
		...left?.preferences,
		...right.preferences
	},
	notifications: {
		...left?.notifications,
		...right.notifications
	}
})

export async function getQueuedSettingsChanges(): Promise<SettingsChanges | null> {
	return (await get<SettingsChanges | null>(QUEUE_KEY)) ?? null
}

export async function enqueueSettingsChanges(
	changes: SettingsChanges
): Promise<void> {
	const current = await getQueuedSettingsChanges()
	await set(QUEUE_KEY, mergeChanges(current ?? undefined, changes))
}

export async function clearQueuedSettingsChanges(
	expected?: SettingsChanges
): Promise<void> {
	if (expected) {
		const current = await getQueuedSettingsChanges()
		if (JSON.stringify(current) !== JSON.stringify(expected)) return
	}

	await del(QUEUE_KEY)
}

/**
 * Replays the coalesced patch using the latest server version. A 409 causes one
 * refetch and retry, so edits made on another device do not permanently block
 * this device's queue. Network failures leave the queue intact.
 */
export async function flushSettingsQueue(): Promise<UserSettingsResponse | null> {
	if (flushPromise) return flushPromise

	flushPromise = (async () => {
		if (typeof navigator !== "undefined" && !navigator.onLine) return null

		const changes = await getQueuedSettingsChanges()
		if (!changes) return null

		try {
			let current = await getUserSettings()

			try {
				const updated = await patchUserSettings({
					...changes,
					version: current.version
				})

				await clearQueuedSettingsChanges(changes)

				return updated
			} catch (error) {
				const { status } = errorCatch(error)

				if (status !== 409) throw error

				current = await getUserSettings()
				const updated = await patchUserSettings({
					...changes,
					version: current.version
				})

				await clearQueuedSettingsChanges(changes)

				return updated
			}
		} catch {
			return null
		}
	})().finally(() => {
		flushPromise = null
	})

	return flushPromise
}
