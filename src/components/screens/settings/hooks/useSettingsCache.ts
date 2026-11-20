"use client"

import { useCallback, useState } from "react"

import { toast } from "@/components/ui/toast"
import { SETTINGS_CACHE_PREFIX } from "@/libs/constants/screens/settings"
import { useCacheStats } from "@/libs/hooks"
import { queryClient } from "@/libs/query/client"

interface UseSettingsCacheReturn {
	totalCacheSize: string | undefined
	isCacheMeasuring: boolean
	isClearing: boolean
	clearCache: () => Promise<void>
}

export const useSettingsCache = (): UseSettingsCacheReturn => {
	const { isMeasuring, querySize } = useCacheStats()

	const [isClearing, setClearing] = useState(false)

	const clearCache = useCallback(async () => {
		if (isClearing) return

		setClearing(true)

		try {
			if ("caches" in window) {
				const keys = await caches.keys()
				const appKeys = keys.filter(key =>
					key.startsWith(SETTINGS_CACHE_PREFIX)
				)

				await Promise.all(appKeys.map(key => caches.delete(key)))
			}

			queryClient.clear()

			toast.success("Локальные данные очищены")
		} catch {
			toast.error("Не удалось очистить локальные данные")
		} finally {
			setClearing(false)
		}
	}, [isClearing])

	return {
		totalCacheSize: querySize?.formatted,
		isCacheMeasuring: isMeasuring,
		isClearing,
		clearCache
	}
}
