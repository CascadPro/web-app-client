import { cva, type VariantProps } from "class-variance-authority"
import { Loader2Icon } from "lucide-react"
import Link from "next/link"
import { type ButtonHTMLAttributes, forwardRef } from "react"

import { cn } from "@/libs/utils"

const buttonVariants = cva(
	"relative inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm motion-reduce:transition-none transition-all will-change-auto active:scale-[.97] [&_svg]:pointer-events-none [&_svg]:select-none disabled:opacity-50! disabled:cursor-not-allowed disabled:pointer-events-none",
	{
		variants: {
			variant: {
				default:
					"bg-primary text-on-primary shadow-sm hover:bg-primary-container/70 active:bg-primary-container/70 hover:text-on-primary-container active:text-on-primary-container active:shadow-lg",
				"default-2":
					"bg-primary/10 text-primary rounded-lg p-1 ring ring-transparent active:scale-[.96] active:ring-secondary/50 hover:ring-secondary/50",
				outline:
					"gap-1 ring ring-outline text-on-background hover:bg-secondary/40 active:bg-secondary/40 active:scale-[.99]",
				ghost: "",
				secondary:
					"bg-secondary text-on-secondary shadow-sm hover:bg-secondary/70 active:bg-secondary/70 active:shadow-md",
				destructive:
					"bg-error-container text-on-error-container hover:bg-error hover:text-on-error active:bg-error active:text-on-error",
				"destructive-outline":
					"text-error bg-error/20 ring-error rounded-xl ring shadow-md active:shadow-none hover:bg-error-container/40 active:bg-error-container/40 active:scale-[.99]"
			}
		},
		defaultVariants: {
			variant: "default"
		}
	}
)

export interface ButtonProps
	extends
		ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean
	href?: string
	isLoading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, isLoading, children, href, ...props }, ref) => {
		const content = href ? (
			<Link href={href} className="h-full w-full">
				{children}
			</Link>
		) : (
			children
		)

		return (
			<button
				className={cn(buttonVariants({ variant, className }))}
				type="button"
				ref={ref}
				{...props}
				disabled={isLoading || props.disabled}
				aria-busy={isLoading || undefined}
				data-loading={isLoading}
			>
				{isLoading ? (
					<>
						{/* Контент остаётся в потоке, поэтому ширина кнопки не «прыгает» */}
						<span
							aria-hidden="true"
							className="invisible inline-flex items-center justify-center"
						>
							{content}
						</span>

						<span className="animate-pop absolute inset-0 grid place-items-center">
							<Loader2Icon
								aria-hidden="true"
								className="h-5 w-5 animate-spin motion-reduce:animate-none"
							/>

							<span className="sr-only">Загрузка</span>
						</span>
					</>
				) : (
					content
				)}
			</button>
		)
	}
)
Button.displayName = "Button"
