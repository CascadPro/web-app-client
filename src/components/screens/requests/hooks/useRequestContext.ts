import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import type { DomainRequestStatus, DomainSortType } from "@/api/generated"
import type { RequestContextState } from "@/types/screens/requests"

const HIGHLIGHT_DURATION = 2600

interface UseRequestContextProviderReturn {
	values: RequestContextState
}

export const useRequestContextProvider =
	(): UseRequestContextProviderReturn => {
		const [statuses, setStatuses] = useState<DomainRequestStatus[]>([])
		const [sortType, setSortType] = useState<DomainSortType>("newest")
		const [highlightId, setHighlightId] = useState<string | null>(null)

		const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

		useEffect(() => () => {
			if (timerRef.current !== null) {
				clearTimeout(timerRef.current)
				timerRef.current = null
			}
		}, [])

		const stopTimer = useCallback(() => {
			if (timerRef.current === null) return

			clearTimeout(timerRef.current)
			timerRef.current = null
		}, [])

		const highlight = useCallback(
			(id: string) => {
				stopTimer()
				setHighlightId(id)

				timerRef.current = setTimeout(() => {
					timerRef.current = null
					setHighlightId(null)
				}, HIGHLIGHT_DURATION)
			},
			[stopTimer]
		)

		const clearHighlight = useCallback(() => {
			stopTimer()
			setHighlightId(null)
		}, [stopTimer])

		const clearFilters = useCallback(() => {
			setStatuses([])
			setSortType("newest")
		}, [])

		const isClearDisabled = useMemo(
			() => statuses.length === 0 && sortType === "newest",
			[statuses, sortType]
		)

		const values = useMemo<RequestContextState>(
			() => ({
				statuses,
				sortType,
				isClearDisabled,
				setStatuses,
				setSortType,
				clearFilters,
				highlightId,
				highlight,
				clearHighlight
			}),
			[
				statuses,
				sortType,
				isClearDisabled,
				clearFilters,
				highlightId,
				highlight,
				clearHighlight
			]
		)

		return { values }
	}
