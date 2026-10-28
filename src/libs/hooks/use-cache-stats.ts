"use client"

import { dehydrate } from "@tanstack/react-query"
import { useCallback, useEffect, useRef, useState } from "react"

import { queryClient } from "@/libs/query/client"
import { getCacheStats } from "@/libs/utils"
import type { CacheSize, CacheStats } from "@/types/cache"

const encoder = new TextEncoder()
const DEBOUNCE_MS = 500

export const useCacheStats = () => {
	const [querySize, setQuerySize] = useState<CacheSize | null>(null)
	const [fullStats, setFullStats] = useState<CacheStats | null>(null)
	const [isMeasuring, setIsMeasuring] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
	const measuringRef = useRef(false)

	const measureAndSet = useCallback(() => {
		setQuerySize(measureQueryClient())
	}, [])

	useEffect(() => {
		const scheduleUpdate = () => {
			if (timerRef.current) {
				clearTimeout(timerRef.current)
			}

			timerRef.current = setTimeout(measureAndSet, DEBOUNCE_MS)
		}

		const unsubscribeQueries = queryClient
			.getQueryCache()
			.subscribe(scheduleUpdate)

		const unsubscribeMutations = queryClient
			.getMutationCache()
			.subscribe(scheduleUpdate)

		return () => {
			unsubscribeQueries()
			unsubscribeMutations()

			if (timerRef.current) {
				clearTimeout(timerRef.current)
				timerRef.current = null
			}
		}
	}, [measureAndSet])

	const refreshAll = useCallback(async () => {
		if (measuringRef.current) return

		measuringRef.current = true
		setIsMeasuring(true)
		setError(null)

		try {
			const result = await getCacheStats(queryClient)

			setFullStats(result)
			setQuerySize(result.queryClient)
		} catch {
			setError("Не удалось измерить хранилища кэша")
		} finally {
			measuringRef.current = false
			setIsMeasuring(false)
		}
	}, [])

	return {
		querySize,
		fullStats,
		isMeasuring,
		error,
		refreshAll
	}
}

function measureQueryClient(): CacheSize {
	const serialized = JSON.stringify(dehydrate(queryClient))
	const bytes = encoder.encode(serialized).byteLength

	if (bytes < 1024) {
		return { bytes, formatted: `${bytes} B` }
	}

	const units = ["KB", "MB", "GB"]
	let size = bytes / 1024
	let unit = 0

	while (size >= 1024 && unit < units.length - 1) {
		size /= 1024
		unit++
	}

	return {
		bytes,
		formatted: `${size.toFixed(2)} ${units[unit]}`
	}
}
