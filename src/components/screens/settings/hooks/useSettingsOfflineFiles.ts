import { useCallback, useState } from "react"

import { toast } from "@/components/ui/toast"
import { useLoadOfflineFiles } from "@/libs/hooks/use-offline-files"
import { useOfflineFilesStore } from "@/store/offline-files"

export const useSettingsOfflineFiles = () => {
	useLoadOfflineFiles()

	const count = useOfflineFilesStore(state => state.count)
	const bytes = useOfflineFilesStore(state => state.bytes)

	const [isClearing, setIsClearing] = useState<boolean>(false)

	const handleClear = useCallback(async () => {
		setIsClearing(true)

		try {
			await useOfflineFilesStore.getState().clear()

			toast.success("Файлы удалены с устройства")
		} catch {
			toast.error("Не удалось очистить файлы")
		} finally {
			setIsClearing(false)
		}
	}, [])

	return {
		count,
		bytes,
		isClearing,
		handleClear
	}
}
