import { usePathname } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

import { useIsIOS } from "@/libs/hooks"

import type { TabsData } from "../tabs"

export const useTabs = (data: TabsData[]) => {
	const isIOS = useIsIOS()

	const pathname = usePathname()

	const [scale, setScale] = useState<number>(1)
	const [currentIndex, setCurrentIndex] = useState<number>(-1)

	const onTabClick = useCallback((index: number) => {
		setScale(1.35)
		setCurrentIndex(index)
		setTimeout(() => setScale(1), 200)
	}, [])

	useEffect(() => {
		for (let i = 0; i < data.length; i++) {
			if (data[i].href === pathname) {
				setCurrentIndex(i)
				break
			}
		}
	}, [pathname])

	return {
		isIOS,
		scale,
		currentIndex,
		onTabClick
	}
}
