import {
	createElement,
	type FC,
	type HTMLAttributes,
	type PropsWithChildren
} from "react"

import { cn } from "@/libs/utils"

type Size = "xs" | "sm" | "md" | "lg" | "xl" | "2xl"

interface Props extends PropsWithChildren, HTMLAttributes<HTMLHeadingElement> {
	size?: Size
}

const Title: FC<Props> = ({ children, size = "sm", className, ...props }) => {
	const mapTagBySize = {
		"2xl": "h1",
		xl: "h1",
		lg: "h2",
		md: "h3",
		sm: "h4",
		xs: "h5"
	} as const

	const mapClassNameBySize = {
		xs: "text-[16px]",
		sm: "text-[20px]",
		md: "text-[22px]",
		lg: "text-[26px]",
		xl: "text-[35px]",
		"2xl": "text-[48px]"
	} as const

	const type = mapTagBySize[size]

	return createElement(
		type,
		{
			className: cn(
				mapClassNameBySize[size],
				{ "text-shadow-[2px_2px_2px]": ["h1", "h2"].includes(type) },
				className
			),
			...props
		},
		children
	)
}

export { Title }
