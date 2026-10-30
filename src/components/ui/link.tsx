import { ArrowUpRightIcon } from "lucide-react"
import Link from "next/dist/client/link"
import type { LinkProps } from "next/link"
import type { AnchorHTMLAttributes, FC, PropsWithChildren } from "react"

import { cn } from "@/libs/utils"

export interface Props extends LinkProps, PropsWithChildren {
	asChild?: boolean
	asAnchor?: boolean
	isOutside?: boolean
}

export type Type = FC<Props & AnchorHTMLAttributes<HTMLAnchorElement>>

const LinkUI: Type = ({
	href,
	children,
	className,
	asAnchor,
	asChild,
	isOutside,
	...props
}) => {
	const newHref = asAnchor ? `#${href}` : href

	return (
		<Link
			href={newHref}
			className={cn(
				"group inline-flex transition-opacity will-change-auto active:opacity-70 motion-reduce:transition-none",
				className
			)}
			{...props}
		>
			{children}
			{isOutside && (
				<span className="inline-flex">
					<ArrowUpRightIcon
						aria-hidden="true"
						size={14}
						className="transition-transform will-change-auto group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none"
					/>
				</span>
			)}
		</Link>
	)
}

export { LinkUI as Link }
