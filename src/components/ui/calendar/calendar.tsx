"use client"

import { AnimatePresence, domMax, LazyMotion, m, Variants } from "motion/react"
import { type FC, memo } from "react"

import { Button } from "@/components/ui/button"
import { DURATION, EASE_OUT } from "@/libs/motion"
import { cn } from "@/libs/utils"

import { CalendarDays } from "./components/calendar-days"
import { CalendarHeader } from "./components/calendar-header"
import { CalendarMonths } from "./components/calendar-months"
import {
	CALENDAR_DEFAULT_LOCALE,
	CALENDAR_DEFAULT_WEEK_START,
	CALENDAR_LABELS
} from "./constants"
import { useCalendar } from "./hooks/useCalendar"
import { useCalendarComponent } from "./hooks/useCalendarComponent"
import type { CalendarProps } from "./types"

const variants: Variants = {
	enter: (direction: number) => ({
		x: direction * 24,
		opacity: 0
	}),
	center: {
		x: 0,
		opacity: 1
	},
	exit: (direction: number) => ({
		x: direction * -24,
		opacity: 0
	})
}

const CalendarComponent: FC<CalendarProps> = ({
	value,
	onChange,
	min,
	max,
	locale = CALENDAR_DEFAULT_LOCALE,
	weekStartsOn = CALENDAR_DEFAULT_WEEK_START,
	autoFocus,
	showToday = true,
	className,
	"aria-label": ariaLabel
}) => {
	const calendar = useCalendar({
		value,
		onChange,
		min,
		max,
		locale,
		weekStartsOn,
		autoFocus
	})

	const { scale, isDays, handleDragEnd } = useCalendarComponent(calendar)

	return (
		<div
			role="group"
			aria-label={ariaLabel}
			className={cn("w-full select-none", className)}
		>
			<CalendarHeader
				view={calendar.view}
				title={calendar.title}
				direction={calendar.direction}
				canPrev={calendar.canPrev}
				canNext={calendar.canNext}
				onNavigate={calendar.navigate}
				onToggleView={calendar.toggleView}
			/>

			<div className="h-74">
				<AnimatePresence
					initial={false}
					mode="sync"
					custom={calendar.direction}
				>
					<LazyMotion features={domMax}>
						<m.div
							key={calendar.view}
							custom={calendar.direction}
							variants={variants}
							initial="enter"
							animate="center"
							exit="exit"
							transition={{
								duration: DURATION.base * scale,
								ease: EASE_OUT
							}}
							className="h-full"
							drag="x"
							dragDirectionLock
							dragConstraints={{ left: 0, right: 0 }}
							dragElastic={0.2}
							dragMomentum={false}
							style={{ touchAction: "pan-y" }}
							onDragEnd={handleDragEnd}
						>
							{isDays ? (
								<CalendarDays
									year={calendar.cursor.year}
									month={calendar.cursor.month}
									title={calendar.title}
									direction={calendar.direction}
									weekdays={calendar.weekdays}
									weeks={calendar.weeks}
									selected={calendar.selected}
									today={calendar.today}
									focused={calendar.focused}
									min={min}
									max={max}
									gridRef={calendar.gridRef}
									onSelect={calendar.select}
									onKeyDown={calendar.handleKeyDown}
								/>
							) : (
								<CalendarMonths
									year={calendar.pickerYear}
									locale={locale}
									selected={calendar.selected}
									today={calendar.today}
									min={min}
									max={max}
									onSelect={calendar.selectMonth}
								/>
							)}
						</m.div>
					</LazyMotion>
				</AnimatePresence>
			</div>

			{showToday && (
				<Button
					variant="default-2"
					className="mt-2 w-full p-2"
					disabled={!calendar.isTodayAllowed}
					onClick={calendar.selectToday}
				>
					{CALENDAR_LABELS.today}
				</Button>
			)}
		</div>
	)
}

export const Calendar = memo(CalendarComponent)
Calendar.displayName = "Calendar"
