import { AnimatePresence, m } from "motion/react"
import type { FC } from "react"

import { cn } from "@/libs/utils"

interface IProps {
	length: number
	maxLength: number | undefined
}

const TextareaCounter: FC<IProps> = ({ length, maxLength }) => {
	return (
		<div className="text-muted absolute right-2 bottom-2 flex items-center text-sm">
			<AnimatePresence mode="popLayout">
				<p
					className={cn("transition-all will-change-auto", {
						"text-base text-black": maxLength === length
					})}
				>
					{length}
				</p>

				{!!maxLength && maxLength !== length && (
					<m.p initial={false} exit={{ opacity: 0, x: 5 }}>
						/{maxLength}
					</m.p>
				)}
			</AnimatePresence>
		</div>
	)
}

export { TextareaCounter }
