"use client"

import { type HTMLMotionProps, m, useReducedMotion } from "motion/react"
import { memo, type ReactNode } from "react"

import { cn } from "@/libs/utils"

import { useModalContent } from "../hooks/useModalContent"
import { getModalTransition } from "../utils"

interface ModalContentProps extends HTMLMotionProps<"div"> {
	children: ReactNode
	className?: string
}

const ModalContentComponent = memo(function ModalContent({
	children,
	className,
	onFocus,
	...props
}: Readonly<ModalContentProps>) {
	const reducedMotion = useReducedMotion() === true
	const { contentRef, handleFocus } = useModalContent(onFocus)

	return (
		<m.div
			{...props}
			ref={contentRef}
			role="document"
			tabIndex={-1}
			initial={{
				opacity: 0,
				y: reducedMotion ? 0 : 24,
				scale: reducedMotion ? 1 : 0.98
			}}
			animate={{
				opacity: 1,
				y: 0,
				scale: 1
			}}
			exit={{
				opacity: 0,
				y: reducedMotion ? 0 : 16,
				scale: reducedMotion ? 1 : 0.98
			}}
			transition={getModalTransition(reducedMotion)}
			className={cn(
				"relative flex max-h-dvh",
				"w-full flex-col overflow-hidden",
				"bg-surface text-on-surface rounded-2xl shadow-2xl",
				"outline-none sm:max-w-lg sm:rounded-2xl",
				className
			)}
			onFocus={handleFocus}
		>
			{children}
		</m.div>
	)
})

export const ModalContent = ModalContentComponent
