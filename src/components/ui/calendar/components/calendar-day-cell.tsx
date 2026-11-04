"use client"

import { m } from "motion/react"
import { type FC, memo } from "react"

import { SPRING } from "@/libs/motion"
import { cn } from "@/libs/utils"

interface Props {
	iso: string
	day: number
	label: string
	selected: boolean
	today: boolean
	disabled: boolean
	/** Единственная ячейка с tabIndex=0 (roving tabindex) */
	tabbable: boolean
	onSelect: (iso: string) => void
}

/**
 * Ячейка мемоизирована и получает только примитивы: при смене выбранной даты
 * или фокуса перерисовываются 1–2 ячейки, а не все 42.
 */
const CalendarDayCellComponent: FC<Props> = ({
	iso,
	day,
	label,
	selected,
	today,
	disabled,
	tabbable,
	onSelect
}) => (
	<td role="gridcell" aria-selected={selected} className="p-0.5 text-center">
		<button
			type="button"
			data-date={iso}
			tabIndex={tabbable ? 0 : -1}
			disabled={disabled}
			aria-label={label}
			aria-current={today ? "date" : undefined}
			onClick={() => onSelect(iso)}
			className={cn(
				"relative h-10 w-full rounded-full text-sm tabular-nums outline-none",
				"transition-[color,background-color,transform] duration-150 motion-reduce:transition-none",
				"focus-visible:ring-primary focus-visible:ring-2 active:scale-90",
				"disabled:text-on-surface-variant/40 disabled:pointer-events-none disabled:active:scale-100",
				selected
					? "text-on-primary font-semibold"
					: "text-on-surface hover:bg-primary/10 active:bg-primary/15",
				today && !selected && "text-primary ring-primary/40 font-semibold ring-1"
			)}
		>
			{selected && (
				<m.span
					aria-hidden
					initial={{ opacity: 0, scale: 0.7 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={SPRING.snappy}
					className="bg-primary absolute inset-0 rounded-full shadow-sm"
				/>
			)}

			<span className="relative">{day}</span>
		</button>
	</td>
)

export const CalendarDayCell = memo(CalendarDayCellComponent)
CalendarDayCell.displayName = "CalendarDayCell"
