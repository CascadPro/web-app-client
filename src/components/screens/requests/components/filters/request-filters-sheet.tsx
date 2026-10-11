import type { FC } from "react"

import type { DomainSortType } from "@/api/generated"
import { BottomSheet, Button } from "@/components/ui"
import { getSortLabel } from "@/libs/utils"
import type { ReactStateHook } from "@/types/base"

interface Props {
	isOpen: boolean
	setIsOpen: ReactStateHook<boolean>
	setSortType: (value: DomainSortType) => void
}

const data: DomainSortType[] = ["newest", "oldest"]

export const RequestFiltersSheet: FC<Props> = ({
	isOpen,
	setIsOpen,
	setSortType
}) => {
	const handleClick = (value: DomainSortType) => {
		setSortType(value)
		setIsOpen(false)
	}

	return (
		<BottomSheet
			open={isOpen}
			onChange={setIsOpen}
			zIndex={8888 + 1}
			offset={-24}
			className="flex flex-col gap-4 px-3 pb-5"
			title="Сортировка"
			titleCN="px-1"
		>
			{data.map(item => (
				<Button
					key={item}
					variant="default-2"
					className="py-2"
					onClick={() => handleClick(item)}
				>
					{getSortLabel(item)}
				</Button>
			))}
		</BottomSheet>
	)
}
