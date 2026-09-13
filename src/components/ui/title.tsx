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
		sm: "text-[18px]",
		md: "text-[22px] font-medium",
		lg: "text-[26px] font-semibold",
		xl: "text-[35px] font-bold",
		"2xl": "text-[48px] font-extrabold"
	} as const

	const type = mapTagBySize[size]

	return createElement(
		type,
		{
			className: cn(
				mapClassNameBySize[size],
				className
			),
			...props
		},
		children
	)
}

export { Title }