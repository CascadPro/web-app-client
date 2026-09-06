import { m } from "motion/react"
import type { FC } from "react"

import { cn } from "@/libs/utils"

interface IProps {
	className?: string
	error: string
}

const ErrorText: FC<IProps> = ({ error, className }) => {
	return (
		<m.p
			initial={{ opacity: 0, y: 5 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: 5 }}
			className={cn("text-sm text-red-500", className)}
		>
			{error}
		</m.p>
	)
}
export { ErrorText }
