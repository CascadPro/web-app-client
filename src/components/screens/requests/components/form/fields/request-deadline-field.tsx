"use client"

import { CalendarDaysIcon, ChevronDownIcon, XIcon } from "lucide-react"
import { AnimatePresence, m } from "motion/react"
import { type FC, memo } from "react"

import { Calendar, formatCalendarDate } from "@/components/ui"
import { DURATION, EASE_OUT, SPRING } from "@/libs/motion"
import { cn } from "@/libs/utils"

import { useRequestDeadline } from "../../../hooks/useRequestDeadline"

import { FieldError } from "./field-error"

interface Props {
	minDate?: string
	clearable?: boolean
}

const RequestDeadlineFieldComponent: FC<Props> = ({
	minDate,
	clearable = true
}) => {
	const {
		labelId,
		valueId,
		panelId,
		messageId,
		panel,
		min,
		value,
		error,
		handleSelect,
		handleClear
	} = useRequestDeadline(minDate)

	return (
		<div>
			<span id={labelId} className="text-on-surface/70 mb-2 block px-1 text-sm">
				Срок сдачи
			</span>

			<div className="relative">
				<button
					ref={panel.triggerRef}
					type="button"
					aria-expanded={panel.isOpen}
					aria-controls={panelId}
					aria-labelledby={`${labelId} ${valueId}`}
					aria-invalid={error ? true : undefined}
					aria-describedby={error ? messageId : undefined}
					onClick={panel.toggle}
					className={cn(
						"ring-outline/40 flex w-full items-center gap-2 rounded-xl py-3 pr-20 pl-3 text-left ring outline-none",
						"transition-shadow motion-reduce:transition-none",
						"focus-visible:ring-primary focus-visible:ring-2",
						panel.isOpen && "ring-primary ring-2",
						error && "ring-error"
					)}
				>
					<CalendarDaysIcon
						size={18}
						aria-hidden
						className="text-on-surface-variant shrink-0"
					/>

					<span
						id={valueId}
						className={cn(
							"min-w-0 truncate",
							!value && "text-on-surface-variant"
						)}
					>
						{value ? formatCalendarDate(value) : "Не указан"}
					</span>
				</button>

				<ChevronDownIcon
					size={18}
					aria-hidden
					className={cn(
						"text-on-surface-variant pointer-events-none absolute top-1/2 right-3 -translate-y-1/2",
						"transition-transform duration-200 motion-reduce:transition-none",
						panel.isOpen && "rotate-180"
					)}
				/>

				<AnimatePresence initial={false}>
					{value && clearable && (
						<m.button
							key="clear"
							type="button"
							aria-label="Сбросить срок сдачи"
							onClick={handleClear}
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.8 }}
							transition={SPRING.snappy}
							className="hover:bg-secondary/40 absolute top-1/2 right-9 -translate-y-1/2 rounded-full p-1.5"
						>
							<XIcon size={16} />
						</m.button>
					)}
				</AnimatePresence>
			</div>

			<AnimatePresence initial={false}>
				{panel.isOpen && (
					<m.div
						key="panel"
						ref={panel.panelRef}
						id={panelId}
						role="group"
						aria-label="Выбор срока сдачи"
						onKeyDown={panel.handleKeyDown}
						initial={{ height: 0 }}
						animate={{ height: "auto" }}
						exit={{ height: 0 }}
						transition={{ duration: DURATION.slow, ease: EASE_OUT }}
						className="overflow-hidden"
					>
						<div className="animate-fade-up pt-3">
							<div className="bg-surface-variant/40 border-outline/20 rounded-2xl border p-3">
								<Calendar
									value={value || null}
									onChange={handleSelect}
									min={min}
									autoFocus
									aria-label="Календарь срока сдачи"
								/>
							</div>
						</div>
					</m.div>
				)}
			</AnimatePresence>

			<FieldError id={messageId} message={error} />
		</div>
	)
}

export const RequestDeadlineField = memo(RequestDeadlineFieldComponent)
RequestDeadlineField.displayName = "RequestDeadlineField"
