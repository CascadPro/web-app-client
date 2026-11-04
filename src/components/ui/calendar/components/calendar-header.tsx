"use client"

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { AnimatePresence, m, type Variants } from "motion/react"
import type { FC } from "react"

import { Button } from "@/components/ui/button"
import { DURATION, EASE_OUT, useMotionScale } from "@/libs/motion"
import { cn } from "@/libs/utils"

import { CALENDAR_LABELS } from "../constants"
import type { CalendarView } from "../types"

const titleSlide: Variants = {
	enter: (direction: number) => ({ opacity: 0, y: direction * 8 }),
	center: { opacity: 1, y: 0 },
	exit: (direction: number) => ({ opacity: 0, y: direction * -8 })
}

interface Props {
	view: CalendarView
	title: string
	direction: 1 | -1
	canPrev: boolean
	canNext: boolean
	onNavigate: (step: 1 | -1) => void
	onToggleView: () => void
}

const NAV_BUTTON =
	"hover:bg-secondary/40 active:bg-secondary/40 shrink-0 rounded-full p-2"

export const CalendarHeader: FC<Props> = ({
	view,
	title,
	direction,
	canPrev,
	canNext,
	onNavigate,
	onToggleView
}) => {
	const scale = useMotionScale()
	const isDays = view === "days"

	return (
		<div className="mb-2 flex items-center justify-between gap-1">
			<Button
				variant="ghost"
				className={cn(NAV_BUTTON, "active:-translate-x-1")}
				aria-label={
					isDays ? CALENDAR_LABELS.prevMonth : CALENDAR_LABELS.prevYear
				}
				disabled={!canPrev}
				onClick={() => onNavigate(-1)}
			>
				<ChevronLeftIcon size={20} />
			</Button>

			<Button
				variant="ghost"
				aria-expanded={!isDays}
				aria-label={`${title}, ${CALENDAR_LABELS.chooseMonth}`}
				onClick={onToggleView}
				className={cn(
					"text-on-surface min-w-42 gap-1 rounded-xl px-3 py-2 text-base",
					"hover:bg-secondary/40 active:bg-secondary/40 transition-colors motion-reduce:transition-none",
					"focus-visible:ring-primary focus-visible:ring-2"
				)}
			>
				<span className="invisible sr-only">{title}</span>

				<AnimatePresence initial={false} mode="popLayout" custom={direction}>
					<m.span
						key={title}
						custom={direction}
						variants={titleSlide}
						initial="enter"
						animate="center"
						exit="exit"
						transition={{ duration: DURATION.fast * scale, ease: EASE_OUT }}
					>
						{title}
					</m.span>
				</AnimatePresence>
			</Button>

			<Button
				variant="ghost"
				className={cn(NAV_BUTTON, "active:translate-x-1")}
				aria-label={
					isDays ? CALENDAR_LABELS.nextMonth : CALENDAR_LABELS.nextYear
				}
				disabled={!canNext}
				onClick={() => onNavigate(1)}
			>
				<ChevronRightIcon size={20} />
			</Button>
		</div>
	)
}
