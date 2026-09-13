import type { FC } from "react"

import type { ModalSectionProps } from "../types"

export const ModalBody: FC<ModalSectionProps> = ({
	children,
	className = ""
}) => (
	<div
		className={`min-h-0 overflow-y-auto overscroll-contain px-5 py-4 sm:px-6 ${className} `}
	>
		{children}
	</div>
)
