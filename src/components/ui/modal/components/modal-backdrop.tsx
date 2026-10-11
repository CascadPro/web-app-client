import { m } from "motion/react"
import type { FC, PointerEvent } from "react"

import { getBackdropTransition } from "../utils"

interface Props {
	onClick?: (event: PointerEvent<HTMLDivElement>) => void
	reducedMotion: boolean
}

export const ModalBackdrop: FC<Props> = ({ onClick, reducedMotion }) => {
	return (
		<m.div
			tabIndex={-1}
			aria-label="Закрыть окно"
			className="pointer-events-auto absolute inset-0 cursor-default bg-black/50 backdrop-blur-xs select-none"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={getBackdropTransition(reducedMotion)}
			onClick={onClick}
			onContextMenu={e => e.preventDefault()}
		/>
	)
}
