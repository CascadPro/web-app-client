"use client"

import { AnimatePresence, m, type Variants } from "motion/react"
import { type FC, type KeyboardEvent, type RefObject } from "react"

import { DURATION, EASE_OUT, useMotionScale } from "@/libs/motion"

import { CALENDAR_SLIDE_DISTANCE } from "../constants"
import type { WeekdayLabel } from "../format"
import type { CalendarCell } from "../types"

import { CalendarDayCell } from "./calendar-day-cell"

const slide: Variants = {
	enter: (direction: number) => ({
		opacity: 0,
		x: direction * CALENDAR_SLIDE_DISTANCE
	}),
	center: { opacity: 1, x: 0 },
	exit: (direction: number) => ({
		opacity: 0,
		x: direction * -CALENDAR_SLIDE_DISTANCE
	})
}

interface Props {
	year: number
	month: number
	title: string
	direction: 1 | -1
	weekdays: WeekdayLabel[]
	weeks: (CalendarCell | null)[][]
	selected: string | null
	today: string
	focused: string
	min?: string
	max?: string
	gridRef: RefObject<HTMLTableSectionElement | null>
	onSelect: (iso: string) => void
	onKeyDown: (event: KeyboardEvent<HTMLElement>) => void
}

export const CalendarDays: FC<Props> = ({
	year,
	month,
	title,
	direction,
	weekdays,
	weeks,
	selected,
	today,
	focused,
	min,
	max,
	gridRef,
	onSelect,
	onKeyDown
}) => {
	const scale = useMotionScale()

	return (
		<div className="relative overflow-hidden">
			<AnimatePresence initial={false} custom={direction} mode="popLayout">
				<m.div
					key={`${year}-${month}`}
					custom={direction}
					variants={slide}
					initial="enter"
					animate="center"
					exit="exit"
					transition={{ duration: DURATION.base * scale, ease: EASE_OUT }}
				>
					<table
						role="grid"
						aria-label={title}
						className="w-full table-fixed border-separate border-spacing-0"
					>
						<thead>
							<tr>
								{weekdays.map(weekday => (
									<th
										key={weekday.long}
										scope="col"
										abbr={weekday.long}
										className="text-on-surface-variant h-8 text-xs font-medium"
									>
										{weekday.short}
									</th>
								))}
							</tr>
						</thead>

						<tbody ref={gridRef} onKeyDown={onKeyDown}>
							{weeks.map((week, index) => (
								<tr key={index}>
									{week.map((cell, column) =>
										cell ? (
											<CalendarDayCell
												key={cell.iso}
												iso={cell.iso}
												day={cell.day}
												label={cell.label}
												selected={cell.iso === selected}
												today={cell.iso === today}
												disabled={
													(!!min && cell.iso < min) || (!!max && cell.iso > max)
												}
												tabbable={cell.iso === focused}
												onSelect={onSelect}
											/>
										) : (
											<td key={column} aria-hidden="true" />
										)
									)}
								</tr>
							))}
						</tbody>
					</table>
				</m.div>
			</AnimatePresence>
		</div>
	)
}
