"use client"

import { AnimatePresence, m } from "motion/react"
import { type FC, memo } from "react"

import { Button } from "@/components/ui/button"
import { DURATION, EASE_OUT, useMotionScale } from "@/libs/motion"
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
import type { CalendarProps } from "./types"

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
	const scale = useMotionScale()

	const calendar = useCalendar({
		value,
		onChange,
		min,
		max,
		locale,
		weekStartsOn,
		autoFocus
	})

	const isDays = calendar.view === "days"

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
				<AnimatePresence initial={false} mode="wait">
					<m.div
						key={calendar.view}
						initial={{ opacity: 0, scale: 0.97 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.97 }}
						transition={{ duration: DURATION.fast * scale, ease: EASE_OUT }}
						className="h-full"
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
