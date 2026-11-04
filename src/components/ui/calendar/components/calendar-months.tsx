"use client"

import { type FC, memo, useMemo } from "react"

import { cn } from "@/libs/utils"

import { CALENDAR_LABELS } from "../constants"
import { formatMonthName } from "../format"
import { isMonthInRange, parseISO } from "../utils"

interface Props {
	year: number
	locale: string
	selected: string | null
	today: string
	min?: string
	max?: string
	onSelect: (month: number) => void
}

const CalendarMonthsComponent: FC<Props> = ({
	year,
	locale,
	selected,
	today,
	min,
	max,
	onSelect
}) => {
	const names = useMemo(
		() => Array.from({ length: 12 }, (_, i) => formatMonthName(i + 1, locale)),
		[locale]
	)

	const selectedParts = selected ? parseISO(selected) : null
	const todayParts = parseISO(today)

	return (
		<div
			role="group"
			aria-label={`${CALENDAR_LABELS.months} ${year}`}
			className="grid h-full grid-cols-3 grid-rows-4 gap-1"
		>
			{names.map((name, index) => {
				const month = index + 1

				const isSelected =
					!!selectedParts &&
					selectedParts.year === year &&
					selectedParts.month === month
				const isCurrent =
					!!todayParts &&
					todayParts.year === year &&
					todayParts.month === month

				return (
					<button
						key={month}
						type="button"
						aria-pressed={isSelected}
						aria-current={isCurrent ? "date" : undefined}
						disabled={!isMonthInRange(year, month, min, max)}
						onClick={() => onSelect(month)}
						className={cn(
							"rounded-2xl text-sm capitalize outline-none",
							"transition-[color,background-color,transform] duration-150 motion-reduce:transition-none",
							"focus-visible:ring-primary focus-visible:ring-2 active:scale-95",
							"disabled:text-on-surface-variant/40 disabled:pointer-events-none",
							isSelected
								? "bg-primary text-on-primary font-semibold"
								: "text-on-surface hover:bg-primary/10 active:bg-primary/15",
							isCurrent &&
								!isSelected &&
								"text-primary ring-primary/40 font-semibold ring-1"
						)}
					>
						{name}
					</button>
				)
			})}
		</div>
	)
}

export const CalendarMonths = memo(CalendarMonthsComponent)
CalendarMonths.displayName = "CalendarMonths"
