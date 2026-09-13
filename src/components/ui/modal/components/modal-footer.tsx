import type { FC } from "react"

import type { ModalSectionProps } from "../types"

export const ModalFooter: FC<ModalSectionProps> = ({
	children,
	className = ""
}) => (
	<div
		className={`flex shrink-0 flex-col-reverse gap-2 border-t border-black/5 p-4 sm:flex-row sm:justify-end sm:px-6 ${className} `}
	>
		{children}
	</div>
)
