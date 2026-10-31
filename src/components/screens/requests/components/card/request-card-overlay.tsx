import { AnimatePresence, m } from "motion/react"
import type { FC } from "react"

import { EASE_OUT } from "@/libs/motion"

interface Props {
	selected: boolean
	handleClickOutside: () => void
}

export const RequestCardOverlay: FC<Props> = ({
	selected,
	handleClickOutside
}) => {
	return (
		<AnimatePresence>
			{selected && (
				<m.div
					className="scrim-strong fixed inset-0 z-200 select-none"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{
						duration: 0.25,
						ease: EASE_OUT
					}}
					onClick={handleClickOutside}
					onContextMenu={e => e.preventDefault()}
				/>
			)}
		</AnimatePresence>
	)
}
