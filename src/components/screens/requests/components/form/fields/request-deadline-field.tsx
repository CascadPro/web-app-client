"use client"

import { CalendarDaysIcon, ChevronDownIcon, XIcon } from "lucide-react"
import { AnimatePresence, m } from "motion/react"
import {
	type FC,
	type KeyboardEvent,
	memo,
	useCallback,
	useEffect,
	useId,
	useMemo,
	useRef,
	useState
} from "react"
import { useController, useFormContext } from "react-hook-form"

import { Calendar, formatCalendarDate } from "@/components/ui"
import { DURATION, EASE_OUT, SPRING, useReduceMotion } from "@/libs/motion"
import type { CreateRequestFormFields } from "@/libs/schemes"
import { cn } from "@/libs/utils"
import { getTodayISO } from "@/libs/utils/screens/request-create"

import { FieldError } from "./field-error"

/** Пауза после выбора даты: успевает проиграться анимация выбранного дня */
const CLOSE_DELAY = 180

interface Props {
	/** Самая ранняя доступная дата. По умолчанию — сегодня */
	minDate?: string
	/** Можно ли стереть выбранный срок (в редактировании уже сохранённый срок стереть нельзя) */
	clearable?: boolean
}

const RequestDeadlineFieldComponent: FC<Props> = ({
	minDate,
	clearable = true
}) => {
	const id = useId()
	const labelId = `${id}-label`
	const valueId = `${id}-value`
	const panelId = `${id}-panel`
	const messageId = `${id}-message`

	const reduceMotion = useReduceMotion()
	const { control, formState } = useFormContext<CreateRequestFormFields>()
	const { field } = useController({ control, name: "deadline" })

	const [isOpen, setIsOpen] = useState(false)

	const triggerRef = useRef<HTMLButtonElement>(null)
	const panelRef = useRef<HTMLDivElement>(null)
	const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

	const today = useMemo(getTodayISO, [])
	const min = minDate ?? today
	const value = field.value
	const error = formState.errors.deadline?.message

	const close = useCallback(
		(restoreFocus: boolean) => {
			setIsOpen(false)
			field.onBlur()

			if (restoreFocus) triggerRef.current?.focus()
		},
		[field]
	)

	const handleSelect = useCallback(
		(iso: string) => {
			field.onChange(iso)

			if (closeTimerRef.current) clearTimeout(closeTimerRef.current)

			closeTimerRef.current = setTimeout(() => close(true), CLOSE_DELAY)
		},
		[field, close]
	)

	const handleClear = useCallback(() => {
		field.onChange("")
		triggerRef.current?.focus()
	}, [field])

	// Escape закрывает календарь, но не всю шторку
	const handleKeyDown = useCallback(
		(event: KeyboardEvent<HTMLDivElement>) => {
			if (event.key !== "Escape") return

			event.stopPropagation()
			close(true)
		},
		[close]
	)

	// Раскрытый календарь может оказаться ниже видимой области — аккуратно докручиваем
	useEffect(() => {
		if (!isOpen) return

		const timer = setTimeout(
			() =>
				panelRef.current?.scrollIntoView({
					block: "nearest",
					behavior: reduceMotion ? "auto" : "smooth"
				}),
			DURATION.base * 1000 + 40
		)

		return () => clearTimeout(timer)
	}, [isOpen, reduceMotion])

	useEffect(
		() => () => {
			if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
		},
		[]
	)

	return (
		<div>
			<span id={labelId} className="text-on-surface/70 mb-2 block px-1 text-sm">
				Срок сдачи
			</span>

			<div className="relative">
				<button
					ref={triggerRef}
					type="button"
					aria-expanded={isOpen}
					aria-controls={panelId}
					aria-labelledby={`${labelId} ${valueId}`}
					aria-invalid={error ? true : undefined}
					aria-describedby={error ? messageId : undefined}
					onClick={() => setIsOpen(open => !open)}
					className={cn(
						"ring-outline/40 flex w-full items-center gap-2 rounded-xl py-3 pr-20 pl-3 text-left ring outline-none",
						"transition-shadow motion-reduce:transition-none",
						"focus-visible:ring-primary focus-visible:ring-2",
						isOpen && "ring-primary ring-2",
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
						isOpen && "rotate-180"
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
				{isOpen && (
					<m.div
						key="panel"
						ref={panelRef}
						id={panelId}
						role="group"
						aria-label="Выбор срока сдачи"
						onKeyDown={handleKeyDown}
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: DURATION.base, ease: EASE_OUT }}
						className="overflow-hidden"
					>
						<div className="pt-2">
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
