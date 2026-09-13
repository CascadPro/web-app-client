import type { FC } from "react"

import type { ModalSectionProps } from "../types"

export const ModalHeader: FC<ModalSectionProps> = ({
	children,
	className = ""
}) => (
	<div className={`shrink-0 px-5 pt-5 sm:px-6 sm:pt-6 ${className} `}>
		{children}
	</div>
)
