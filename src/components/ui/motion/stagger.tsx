"use client"

import { type HTMLMotionProps, m } from "motion/react"
import { type FC, useMemo } from "react"

import { createStagger, fadeUp, useReduceMotion } from "@/libs/motion"

interface StaggerProps extends HTMLMotionProps<"div"> {
	stagger?: number
	delay?: number
}

/**
 * Контейнер: дочерние `StaggerItem` появляются по очереди.
 * При «уменьшить анимации» всё сразу рендерится в конечном состоянии.
 */
export const Stagger: FC<StaggerProps> = ({
	stagger = 0.05,
	delay = 0,
	...props
}) => {
	const reduceMotion = useReduceMotion()
	const variants = useMemo(
		() => createStagger(stagger, delay),
		[stagger, delay]
	)

	return (
		<m.div
			variants={variants}
			initial={reduceMotion ? false : "hidden"}
			animate="visible"
			{...props}
		/>
	)
}

export const StaggerItem: FC<HTMLMotionProps<"div">> = props => (
	<m.div variants={fadeUp} {...props} />
)
