"use client"

import { AnimatePresence, m } from "motion/react"
import type { FC } from "react"

import { DURATION, EASE_OUT } from "@/libs/motion"
import { cn } from "@/libs/utils"

interface Props {
	id?: string
	message?: string | null
	tone?: "error" | "hint"
}

/** Сообщение «раскрывается» по высоте, поэтому соседние поля не прыгают */
export const FieldError: FC<Props> = ({ id, message, tone = "error" }) => (
	<AnimatePresence initial={false}>
		{message && (
			<m.div
				key="message"
				initial={{ opacity: 0, height: 0 }}
				animate={{ opacity: 1, height: "auto" }}
				exit={{ opacity: 0, height: 0 }}
				transition={{ duration: DURATION.base, ease: EASE_OUT }}
				className="overflow-hidden"
			>
				<p
					id={id}
					role={tone === "error" ? "alert" : "status"}
					className={cn(
						"px-1.5 pt-1 text-sm leading-4",
						tone === "error" ? "text-error" : "text-on-surface-variant"
					)}
				>
					{message}
				</p>
			</m.div>
		)}
	</AnimatePresence>
)
