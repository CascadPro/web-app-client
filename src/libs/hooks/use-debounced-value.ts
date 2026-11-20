"use client"

import { useEffect, useState } from "react"

/**
 * Значение, которое «догоняет» оригинал с задержкой: пока человек печатает,
 * оно не меняется, и запрос на каждый символ не уходит.
 */
export const useDebouncedValue = <T>(value: T, delay = 300): T => {
	const [debounced, setDebounced] = useState(value)

	useEffect(() => {
		const timer = setTimeout(() => setDebounced(value), delay)

		return () => clearTimeout(timer)
	}, [value, delay])

	return debounced
}
