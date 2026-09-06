import { XIcon } from "lucide-react"
import type { FC } from "react"

import { cn } from "@/libs/utils"

interface IProps {
	className?: string
	value: string | undefined
	onClick: VoidFunction
}

const ClearButton: FC<IProps> = ({ value, onClick, className }) => {
	return (
		<button
			type="button"
			title="Очистить"
			className={cn(
				"clear-btn absolute top-1/2 right-1.5 z-20 translate-y-[-25%] scale-100 p-px opacity-100 transition-all will-change-auto [&:hover>svg]:opacity-100 [&>svg]:opacity-70 [&>svg]:transition-opacity [&>svg]:duration-200 [&>svg]:will-change-auto",
				{
					"pointer-events-none! scale-95! opacity-0!": !value
				},
				className
			)}
			onClick={onClick}
		>
			<XIcon size={24} />
		</button>
	)
}

export { ClearButton }
