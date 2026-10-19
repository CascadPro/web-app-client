"use client"

import {
	AnimatePresence,
	m,
	useIsPresent,
	useReducedMotion
} from "motion/react"
import { LayoutRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime"
import { usePathname } from "next/navigation"
import {
	type FC,
	type PropsWithChildren,
	useContext,
	useLayoutEffect,
	useRef
} from "react"

import { useSettingsContext } from "@/components/providers/settings-provider"

interface Props extends PropsWithChildren {}

const RouteTransitionContent: FC<Props> = ({ children }) => {
	const isPresent = useIsPresent()
	const routerContext = useContext(LayoutRouterContext)
	const previousContext = useRef(routerContext)

	useLayoutEffect(() => {
		if (isPresent) {
			previousContext.current = routerContext
		}
	}, [isPresent, routerContext])

	return (
		<LayoutRouterContext.Provider
			value={isPresent ? routerContext : previousContext.current}
		>
			<div
				inert={!isPresent}
				style={{
					pointerEvents: isPresent ? "auto" : "none"
				}}
			>
				{children}
			</div>
		</LayoutRouterContext.Provider>
	)
}

const RouteTransition: FC<Props> = ({ children }) => {
	const systemReducedMotion = useReducedMotion()
	const { settings } = useSettingsContext()

	const reduceMotion =
		settings.animations === "disabled" ||
		(settings.animations !== "enabled" && Boolean(systemReducedMotion))

	return (
		<m.div
			initial={reduceMotion ? false : "hidden"}
			animate="visible"
			exit="exit"
			variants={{
				hidden: { opacity: 0, scale: 0.97 },
				visible: { opacity: 1, scale: 1 },
				exit: { opacity: 0, y: 8, scale: 0.97 }
			}}
			transition={{
				opacity: {
					duration: reduceMotion ? 0 : 0.16,
					ease: "easeOut"
				},
				y: {
					duration: reduceMotion ? 0 : 0.2,
					ease: [0.22, 1, 0.36, 1]
				}
			}}
		>
			<RouteTransitionContent>{children}</RouteTransitionContent>
		</m.div>
	)
}

export const RouteTransitionProvider: FC<Props> = ({ children }) => {
	const pathname = usePathname()

	return (
		<AnimatePresence mode="wait" initial={false}>
			<RouteTransition key={pathname}>{children}</RouteTransition>
		</AnimatePresence>
	)
}
