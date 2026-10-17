"use client"

import { AnimatePresence, m } from "motion/react"

import { TOAST_POSITONS } from "../constants"
import { useToastViewport } from "../hooks/useToastViewport"

import { ToastItem } from "./toast-item"

export const ToastViewport = () => {
	const { groups, reduceMotion } = useToastViewport()

	return (
		<>
			{Array.from(groups, ([position, group]) => (
				<div
					key={position}
					aria-label="Уведомления"
					className={`pointer-events-none fixed z-9999 flex w-[calc(100vw-2rem)] max-w-95 flex-col gap-2.5 ${TOAST_POSITONS[position]} `}
				>
					<AnimatePresence mode="popLayout">
						{group.map(item => (
							<m.div
								key={item.id}
								layout={!reduceMotion}
								className="pointer-events-auto grid w-full"
							>
								<ToastItem item={item} />
							</m.div>
						))}
					</AnimatePresence>
				</div>
			))}
		</>
	)
}
