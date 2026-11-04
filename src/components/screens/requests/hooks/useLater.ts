"use client"

import { useCallback, useEffect, useRef } from "react"

/** setTimeout, который сам очищается при размонтировании компонента */
export const useLater = () => {
	const timersRef = useRef(new Set<ReturnType<typeof setTimeout>>())

	useEffect(() => {
		const timers = timersRef.current

		return () => {
			timers.forEach(clearTimeout)
			timers.clear()
		}
	}, [])

	return useCallback((callback: () => void, delay: number) => {
		const timer = setTimeout(() => {
			timersRef.current.delete(timer)
			callback()
		}, delay)

		timersRef.current.add(timer)
	}, [])
}
