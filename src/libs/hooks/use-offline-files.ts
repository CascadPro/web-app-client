"use client"

import { useEffect } from "react"

import { useOfflineFilesStore } from "@/store/offline-files"

let loaded = false

/** Один раз за сессию читает список сохранённых файлов с устройства */
export const useLoadOfflineFiles = (): void => {
	useEffect(() => {
		if (loaded) return

		loaded = true

		void useOfflineFilesStore.getState().refresh()
	}, [])
}

/** Есть ли у файла копия на устройстве (доступна без сети) */
export const useIsFileOffline = (id?: string): boolean => {
	useLoadOfflineFiles()

	return useOfflineFilesStore(state => (id ? state.ids.has(id) : false))
}
