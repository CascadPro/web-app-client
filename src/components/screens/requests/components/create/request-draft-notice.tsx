"use client"

import { HistoryIcon, XIcon } from "lucide-react"
import { AnimatePresence, m } from "motion/react"
import type { FC } from "react"

import { DURATION, EASE_OUT, INSTANT, useReduceMotion } from "@/libs/motion"

interface Props {
	visible: boolean
	onDismiss: () => void
}

export const RequestDraftNotice: FC<Props> = ({ visible, onDismiss }) => {
	const reduceMotion = useReduceMotion()

	const initial = reduceMotion ? undefined : { opacity: 0, height: 0 }
	const exit = reduceMotion ? undefined : { opacity: 0, height: 0 }
	const transition = reduceMotion ? INSTANT : { duration: DURATION.base, ease: EASE_OUT }

	return (
		<AnimatePresence initial={false}>
			{visible && (
				<m.div
					key="notice"
					role="status"
					initial={initial}
					animate={{ opacity: 1, height: "auto" }}
					exit={exit}
					transition={transition}
					className="overflow-hidden"
				>
					<div className="bg-primary/10 text-primary mb-2 flex items-center gap-2 rounded-2xl px-(--mini-row-padding-x) py-(--mini-row-padding-y) text-sm">
						<HistoryIcon size={16} className="shrink-0" />

						<span className="flex-1">Восстановлен несохранённый черновик</span>

						<button
							type="button"
							aria-label="Скрыть уведомление"
							onClick={onDismiss}
							className="rounded-lg p-1"
						>
							<XIcon size={16} />
						</button>
					</div>
				</m.div>
			)}
		</AnimatePresence>
	)
}
