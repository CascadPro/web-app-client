"use client"

import { useEffect } from "react"

import { createLazyLoader, useLazySheet } from "@/libs/hooks/use-lazy-sheet"
import { useLowPerf } from "@/libs/motion"

type NavigatorWithConnection = Navigator & {
	connection?: { saveData?: boolean }
}

const loadSheet = createLazyLoader(() =>
	import("../components/create/request-create-sheet").then(
		mod => mod.RequestCreateSheet
	)
)

/** Ленивая шторка создания заявки + тихая предзагрузка в простое браузера */
export const useRequestCreateSheet = () => {
	const lowPerf = useLowPerf()
	const sheet = useLazySheet(loadSheet)

	const { preload } = sheet

	// На слабых устройствах и в режиме экономии трафика заранее не грузим
	useEffect(() => {
		const connection = (navigator as NavigatorWithConnection).connection

		if (lowPerf || connection?.saveData) return

		if ("requestIdleCallback" in window) {
			const id = window.requestIdleCallback(preload, { timeout: 4000 })

			return () => window.cancelIdleCallback(id)
		}

		const timer = setTimeout(preload, 2000)

		return () => clearTimeout(timer)
	}, [lowPerf, preload])

	return sheet
}
