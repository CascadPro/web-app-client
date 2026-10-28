"use client"

import { useCallback, useState } from "react"

import { SETTINGS_CACHE_PREFIX } from "@/libs/constants/screens/settings"
import { useCacheStats } from "@/libs/hooks"
import { queryClient } from "@/libs/query/client"

interface UseSettingsCacheReturn {
	totalCacheSize: string | undefined
	isCacheMeasuring: boolean
	clearing: boolean
	clearCache: () => Promise<void>
}

export const useSettingsCache = (): UseSettingsCacheReturn => {
	const { isMeasuring, querySize } = useCacheStats()

	const [clearing, setClearing] = useState(false)

	const clearCache = useCallback(async () => {
		if (clearing) return

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
		} finally {
			setClearing(false)
		}
	}, [clearing])

	return {
		totalCacheSize: querySize?.formatted,
		isCacheMeasuring: isMeasuring,
		clearing,
		clearCache
	}
}
