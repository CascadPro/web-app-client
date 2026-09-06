import { EyeIcon, EyeOffIcon } from "lucide-react"
import type { FC } from "react"

import { cn } from "@/libs/utils"

interface IProps {
	className?: string
	value: boolean
	onClick: VoidFunction
}

const PasswordEye: FC<IProps> = ({ onClick, value, className }) => {
	const title = value ? "Скрыть пароль" : "Показать пароль"

	return (
		<button
			type="button"
			title={title}
			onClick={onClick}
			className={cn(
				"absolute top-1/2 right-2 z-20 translate-y-[-25%] p-px [&:hover>svg]:opacity-100 [&>svg]:opacity-70 [&>svg]:transition-opacity [&>svg]:will-change-auto [&~.clear-btn]:right-9",
				className
			)}
		>
			{value ? <EyeOffIcon size={24} /> : <EyeIcon size={24} />}
		</button>
	)
}

export { PasswordEye }
