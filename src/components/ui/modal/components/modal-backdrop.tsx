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
			className="pointer-events-auto absolute inset-0 scrim cursor-default select-none"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={getBackdropTransition(reducedMotion)}
			onClick={onClick}
			onContextMenu={e => e.preventDefault()}
		/>
	)
}
