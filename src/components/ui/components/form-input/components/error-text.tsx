import { m } from "motion/react"
import type { FC } from "react"

import { cn } from "@/libs/utils"

interface IProps {
	id?: string
	className?: string
	error: string
}

const ErrorText: FC<IProps> = ({ error, id, className }) => {
	return (
		<m.p
			id={id}
			role="alert"
			initial={{ opacity: 0, y: 5 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: 5 }}
			className={cn("text-sm text-red-500", className)}
		>
			{/* key — чтобы встряска проигрывалась и при смене текста ошибки */}
			<span key={error} className="animate-shake inline-block">
				{error}
			</span>
		</m.p>
	)
}
export { ErrorText }
