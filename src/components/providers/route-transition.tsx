"use client"

import { m } from "motion/react"
import { usePathname } from "next/navigation"
import { type FC, type PropsWithChildren, useEffect, useRef } from "react"

import { EASE_OUT, useReduceMotion } from "@/libs/motion"

interface Props extends PropsWithChildren {}

/**
 * Анимация входа новой страницы. Ключ — pathname, поэтому контент
 * перемонтируется при навигации.
 *
 * Раньше здесь была анимация выхода через внутренний LayoutRouterContext из
 * next/dist — он не входит в публичный API и может сломаться при обновлении Next.
 * Теперь только вход (opacity + y), без внутренних импортов.
 */
export const RouteTransitionProvider: FC<Props> = ({ children }) => {
	const pathname = usePathname()
	const reduceMotion = useReduceMotion()

	// Первую загрузку не анимируем — страницу уже закрывает сплеш
	const isFirstRender = useRef(true)

	useEffect(() => {
		isFirstRender.current = false
	}, [])

	return (
		<m.div
			key={pathname}
			initial={
				reduceMotion || isFirstRender.current ? false : { opacity: 0, y: 8 }
			}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.2, ease: EASE_OUT }}
		>
			{children}
		</m.div>
	)
}
