"use client"

import { type HTMLMotionProps, m } from "motion/react"
import type { FC, ReactNode } from "react"

import { useModalContent } from "../hooks/useModalContent"

const contentVariants = {
	hidden: {
		opacity: 0,
		y: 32,
		scale: 0.98
	},
	visible: {
		opacity: 1,
		y: 0,
		scale: 1
	},
	exit: {
		opacity: 0,
		y: 20,
		scale: 0.98
	}
}

interface Props extends HTMLMotionProps<"div"> {
	children: ReactNode
	className?: string
}

export const ModalContent: FC<Props> = ({
	children,
	className = "",
	onFocus,
	...props
}) => {
	const { contentRef, handleFocus } = useModalContent(onFocus)

	return (
		<m.div
			ref={contentRef}
			tabIndex={-1}
			variants={contentVariants}
			initial="hidden"
			animate="visible"
			exit="exit"
			transition={{
				type: "spring",
				stiffness: 420,
				damping: 32,
				mass: 0.7
			}}
			className={`bg-surface text-on-surface relative overflow-hidden rounded-2xl shadow-2xl outline-none sm:max-w-lg ${className} `}
			onFocus={handleFocus}
			{...props}
		>
			{children}
		</m.div>
	)
}
