import { AnimatePresence, m } from "motion/react"
import type { FC } from "react"

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
					className="bg-background/25 fixed inset-0 z-200 backdrop-blur-lg select-none"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{
						duration: 0.25,
						ease: [0.22, 1, 0.36, 1]
					}}
					onClick={handleClickOutside}
					onContextMenu={e => e.preventDefault()}
				/>
			)}
		</AnimatePresence>
	)
}
