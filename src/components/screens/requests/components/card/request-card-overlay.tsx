import { AnimatePresence, m } from "motion/react"
import type { FC } from "react"

import { EASE_OUT, INSTANT, useReduceMotion } from "@/libs/motion"

interface Props {
	selected: boolean
	handleClickOutside: () => void
}

export const RequestCardOverlay: FC<Props> = ({
	selected,
	handleClickOutside
}) => {
	const reduceMotion = useReduceMotion()

	const initial = reduceMotion ? undefined : { opacity: 0 }
	const exit = reduceMotion ? undefined : { opacity: 0 }
	const transition = reduceMotion ? INSTANT : { duration: 0.25, ease: EASE_OUT }

	return (
		<AnimatePresence>
			{selected && (
				<m.div
					className="scrim-strong fixed inset-0 z-200 select-none"
					initial={initial}
					animate={{ opacity: 1 }}
					exit={exit}
					transition={transition}
					onClick={handleClickOutside}
					onContextMenu={e => e.preventDefault()}
				/>
			)}
		</AnimatePresence>
	)
}
