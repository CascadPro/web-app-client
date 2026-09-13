import type { FC } from "react"

import { Title } from "@/components/ui/title"

import type { ModalSectionProps } from "../types"

export const ModalTitle: FC<ModalSectionProps> = ({
	children,
	className = ""
}: ModalSectionProps) => {
	return (
		<Title size="md" className={className}>
			{children}
		</Title>
	)
}
