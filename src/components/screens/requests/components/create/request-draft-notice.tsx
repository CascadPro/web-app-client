"use client"

import { HistoryIcon, XIcon } from "lucide-react"
import { AnimatePresence, m } from "motion/react"
import type { FC } from "react"

import { DURATION, EASE_OUT } from "@/libs/motion"

interface Props {
	visible: boolean
	onDismiss: () => void
}

export const RequestDraftNotice: FC<Props> = ({ visible, onDismiss }) => (
	<AnimatePresence initial={false}>
		{visible && (
			<m.div
				key="notice"
				role="status"
				initial={{ opacity: 0, height: 0 }}
				animate={{ opacity: 1, height: "auto" }}
				exit={{ opacity: 0, height: 0 }}
				transition={{ duration: DURATION.base, ease: EASE_OUT }}
				className="overflow-hidden"
			>
				<div className="bg-primary/10 text-primary mt-1 flex items-center gap-2 rounded-2xl px-3 py-2 text-sm">
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
