"use client"

import { RefreshCwIcon } from "lucide-react"
import { m } from "motion/react"
import type { FC, PropsWithChildren } from "react"

import {
	useRefreshControl,
	useRefreshControlValues
} from "./hooks/useRefreshControl"

interface Props extends PropsWithChildren {
	onRefresh: () => Promise<void> | void
	threshold?: number
}

export const PullToRefresh: FC<Props> = ({
	children,
	onRefresh,
	threshold = 80
}) => {
	const { pull, maxPull, currentPull, isRefreshing, isPulling } =
		useRefreshControl(threshold, onRefresh)

	const {
		progress,
		indicatorY,
		indicatorOpacity,
		indicatorScale,
		indicatorRotate
	} = useRefreshControlValues(pull, threshold, maxPull)

	return (
		<div className="relative h-full">
			<m.div
				className="pointer-events-none fixed top-3 left-1/2 z-200 -translate-x-1/2"
				style={{
					y: indicatorY,
					opacity: indicatorOpacity,
					scale: indicatorScale
				}}
			>
				<m.div
					className="bg-background border-outline/20 text-on-surface flex size-11 items-center justify-center rounded-full border shadow-xl"
					style={{ rotate: indicatorRotate }}
					animate={
						isRefreshing
							? {
									scale: [1, 1.08, 1],
									transition: {
										duration: 0.8,
										repeat: Infinity,
										ease: "easeInOut"
									}
								}
							: isPulling && currentPull.current >= threshold
								? {
										scale: [1, 1.08, 1],
										transition: {
											duration: 0.45,
											repeat: Infinity,
											ease: "easeInOut"
										}
									}
								: { scale: 1 }
					}
				>
					<m.div
						animate={
							isRefreshing
								? {
										rotate: 360,
										transition: {
											duration: 0.8,
											repeat: Infinity,
											ease: "linear"
										}
									}
								: { rotate: 0 }
						}
					>
						<RefreshCwIcon className="size-5" />
					</m.div>
				</m.div>
			</m.div>

			<div>{children}</div>

			<m.div
				className="-origin-left pointer-events-none fixed top-0 left-1/2 z-199 h-0.5 -translate-x-1/2 bg-current"
				style={{ scaleX: progress, opacity: indicatorOpacity }}
			/>
		</div>
	)
}
