import { m } from "motion/react"
import type { FC } from "react"

import { cn } from "@/libs/utils"

import { useMarqueeText } from "./hook"
import type { MarqueeTextProps } from "./types"

export const MarqueeText: FC<MarqueeTextProps> = ({
	children,
	className,
	shadow = true,
	options = {},
	tag = "p"
}) => {
	const {
		containerRef,
		handleMouseEnter,
		handleMouseLeave,
		textRef,
		controls
	} = useMarqueeText(options)

	const Comp = m[tag]

	return (
		<div
			ref={containerRef}
			className={cn(
				"relative min-w-0 overflow-hidden",
				shadow &&
					"after:absolute after:top-0 after:right-0 after:h-full after:w-4 after:content-['']",
				shadow && "after:bg-[linear-gradient(90deg,transparent,var(--surface))]"
			)}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			<Comp
				ref={textRef}
				animate={controls}
				className={cn("zmax-w-none w-max pr-5 whitespace-nowrap", className)}
			>
				{children}
			</Comp>
		</div>
	)
}
