"use client"

import { dehydrate } from "@tanstack/react-query"
import { useCallback, useEffect, useRef, useState } from "react"

import { queryClient } from "@/libs/query/client"
import { getCacheStats } from "@/libs/utils"
import type { CacheSize, CacheStats } from "@/types/cache"

const encoder = new TextEncoder()
const SAMPLE_INTERVAL_MS = 5000

export const useCacheStats = () => {
	const [querySize, setQuerySize] = useState<CacheSize | null>(null)
	const [fullStats, setFullStats] = useState<CacheStats | null>(null)
	const [isMeasuring, setIsMeasuring] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const measuringRef = useRef(false)

	const measureAndSet = useCallback(() => {
		setQuerySize(measureQueryClient())
	}, [])

	useEffect(() => {
		const interval = setInterval(measureAndSet, SAMPLE_INTERVAL_MS)
		// Initial measurement
		measureAndSet()

		return () => clearInterval(interval)
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
