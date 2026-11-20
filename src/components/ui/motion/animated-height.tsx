"use client"

import { m } from "motion/react"
import {
	type FC,
	type PropsWithChildren,
	useLayoutEffect,
	useRef,
	useState
} from "react"

import {
	DURATION,
	EASE_OUT,
	INSTANT,
	useMotionScale,
	useReduceMotion
} from "@/libs/motion"

interface Props extends PropsWithChildren {
	className?: string
}

/**
 * Плавно меняет высоту, когда содержимое выросло или уменьшилось
 * (новая строка тегов, появившееся сообщение и т.п.).
 * Содержимое измеряется ResizeObserver, анимируется только внешний контейнер.
 */
export const AnimatedHeight: FC<Props> = ({ children, className }) => {
	const innerRef = useRef<HTMLDivElement>(null)
	const [height, setHeight] = useState<number | null>(null)

	const reduceMotion = useReduceMotion()
	const scale = useMotionScale()

	useLayoutEffect(() => {
		const element = innerRef.current

		if (!element) return

		setHeight(element.offsetHeight)

		const observer = new ResizeObserver(entries => {
			const size = entries[0]?.borderBoxSize?.[0]?.blockSize

			setHeight(size ?? element.offsetHeight)
		})

		observer.observe(element)

		return () => observer.disconnect()
	}, [])

	return (
		<m.div
			initial={false}
			animate={height === null ? undefined : { height }}
			transition={
				reduceMotion
					? INSTANT
					: { duration: DURATION.base * scale, ease: EASE_OUT }
			}
			style={{ overflow: "hidden" }}
			className={className}
		>
			<div ref={innerRef}>{children}</div>
		</m.div>
	)
}
