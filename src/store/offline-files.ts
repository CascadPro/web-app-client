import { create } from "zustand"

import {
	clearOfflineFiles,
	listOfflineMeta,
	type OfflineFileEntry,
	type OfflineFileMeta,
	readOfflineFile,
	removeOfflineFile,
	writeOfflineFile
} from "@/libs/storage/offline-files"

interface OfflineFilesStore {
	/** Идентификаторы файлов, доступных без сети */
	ids: ReadonlySet<string>
	count: number
	bytes: number

	refresh: () => Promise<void>
	save: (entry: OfflineFileEntry) => Promise<boolean>
	read: (
		id: string,
		expectedSize?: number | null
	) => Promise<{ blob: Blob; meta: OfflineFileMeta } | null>
	remove: (id: string) => Promise<void>
	clear: () => Promise<void>
}

export const useOfflineFilesStore = create<OfflineFilesStore>((set, get) => ({
	ids: new Set<string>(),
	count: 0,
	bytes: 0,

	refresh: async () => {
		const metas = await listOfflineMeta()

		set({
			ids: new Set(metas.map(meta => meta.id)),
			count: metas.length,
			bytes: metas.reduce((sum, meta) => sum + meta.size, 0)
		})
	},

	save: async entry => {
		const saved = await writeOfflineFile(entry)

		if (saved) await get().refresh()

		return saved
	},

	read: async (id, expectedSize) => {
		const result = await readOfflineFile(id, expectedSize)

		// Копия оказалась битой и была удалена — обновляем индикаторы
		if (!result && get().ids.has(id)) await get().refresh()

		return result
	},

	remove: async id => {
		await removeOfflineFile(id)
		await get().refresh()
	},

	clear: async () => {
		await clearOfflineFiles()

		set({ ids: new Set<string>(), count: 0, bytes: 0 })
	}
}))
