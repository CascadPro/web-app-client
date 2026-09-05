import { cva, type VariantProps } from "class-variance-authority"
import { Loader2Icon } from "lucide-react"
import Link from "next/link"
import { type ButtonHTMLAttributes, forwardRef } from "react"

import { cn } from "@/libs/utils"

const buttonVariants = cva(
	"relative inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm transition-all will-change-auto [&_svg]:pointer-events-none [&_svg]:select-none",
	{
		variants: {
			variant: {
				default:
					"bg-primary text-primary-foreground shadow hover:bg-primary/90 active:bg-primary/90 active:shadow-md",
				outline:
					"gap-1 border border-outline text-on-background hover:bg-secondary/40 active:bg-secondary/40 active:scale-[.99]",
				ghost: "",
				secondary:
					"bg-secondary text-on-secondary shadow-sm hover:bg-secondary/70 active:bg-secondary/70 active:shadow-md",
				tertiary:
					"bg-tertiary text-on-tertiary shadow-sm hover:bg-tertiary/50 active:bg-tertiary/50",
				destructive:
					"bg-error-container text-on-error-container hover:bg-error hover:text-on-error active:bg-error active:text-on-error",
				"destructive-outline":
					"border border-error-container text-error bg-transparent hover:bg-error-container/40 active:bg-error-container/40 active:scale-[.99]"
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
		let content: React.ReactNode

		if (isLoading) {
			content = <Loader2Icon className="h-5 w-5 animate-spin" />
		} else if (href) {
			content = (
				<Link href={href} className="h-full w-full">
					{children}
				</Link>
			)
		} else {
			content = children
		}

		return (
			<button
				className={cn(buttonVariants({ variant, className }))}
				type="button"
				ref={ref}
				disabled={isLoading || props.disabled}
				{...props}
				data-loading={isLoading}
			>
				{content}
			</button>
		)
	}
)
Button.displayName = "Button"
