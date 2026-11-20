import { forwardRef, type InputHTMLAttributes } from "react"

import { cn } from "@/libs/utils"

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(
	({ className, type, disabled, ...props }, ref) => {
		return (
			<input
				type={type}
				className={cn(
					"bg-surface/60 placeholder:text-on-surface/70 flex w-full rounded-xl px-3 py-3 text-sm",
					"transition-ui will-change-auto motion-reduce:transition-none",
					"caret-primary ring-outline/40 ring",
					"focus-visible:ring-primary/70 focus-visible:outline-none",
					{ "border-0 bg-transparent text-sm font-medium": type === "file" },
					{ "cursor-not-allowed opacity-50": disabled },
					className
				)}
				ref={ref}
				{...props}
			/>
		)
	}
)
Input.displayName = "Input"

export { Input }
