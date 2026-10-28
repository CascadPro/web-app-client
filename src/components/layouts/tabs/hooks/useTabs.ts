import { usePathname } from "next/navigation"
import { useCallback, useLayoutEffect, useRef, useState } from "react"

import { useIsIOS } from "@/libs/hooks"

import type { TabsData } from "../tabs"

const TAB_SCALE_TRANSITION_MS = 200

export const useTabs = (data: TabsData[]) => {
	const isIOS = useIsIOS()

	const pathname = usePathname()

	const [scale, setScale] = useState<number>(1)
	const [currentIndex, setCurrentIndex] = useState<number>(-1)

	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

	const onTabClick = useCallback((index: number) => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current)
		}

		setScale(0.75)
		setCurrentIndex(index)

		timeoutRef.current = setTimeout(() => {
			setScale(1)
			timeoutRef.current = null
		}, TAB_SCALE_TRANSITION_MS)
	}, [])

	useLayoutEffect(() => {
		for (let i = 0; i < data.length; i++) {
			if (data[i].href === pathname) {
				setCurrentIndex(i)
				break
			}
		}
	}, [pathname])

	useLayoutEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current)
				timeoutRef.current = null
			}
		}
	}, [])

	return {
		isIOS,
		scale,
		currentIndex,
		onTabClick
	}
}
