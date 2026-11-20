"use client"

import {
	type KeyboardEvent,
	useCallback,
	useEffect,
	useRef,
	useState
} from "react"

import { DURATION, useReduceMotion } from "@/libs/motion"

interface Options {
	/** Вызывается при закрытии (например, field.onBlur, чтобы сработала валидация) */
	onClose?: () => void
}

/**
 * Раскрывающаяся под полем панель (календарь, выбор клиента):
 * Escape закрывает панель, а не всю шторку; фокус возвращается на кнопку-триггер;
 * раскрытая панель докручивается в видимую область; отложенное закрытие
 * даёт доиграть анимации выбора.
 */
export const useInlinePanel = ({ onClose }: Options = {}) => {
	const reduceMotion = useReduceMotion()

	const [isOpen, setIsOpen] = useState(false)

	const triggerRef = useRef<HTMLButtonElement>(null)
	const panelRef = useRef<HTMLDivElement>(null)
	const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

	const toggle = useCallback(() => setIsOpen(open => !open), [])

	const close = useCallback(
		(restoreFocus: boolean) => {
			setIsOpen(false)
			onClose?.()

			if (restoreFocus) triggerRef.current?.focus()
		},
		[onClose]
	)

	/** Закрыть через паузу (например, после выбора даты) */
	const closeAfter = useCallback(
		(delay: number) => {
			if (closeTimerRef.current) clearTimeout(closeTimerRef.current)

			closeTimerRef.current = setTimeout(() => close(true), delay)
		},
		[close]
	)

	const handleKeyDown = useCallback(
		(event: KeyboardEvent<HTMLElement>) => {
			if (event.key !== "Escape") return

			// Иначе Escape закрыл бы и шторку с формой
			event.stopPropagation()
			close(true)
		},
		[close]
	)

	// Раскрытая панель может оказаться ниже видимой области — аккуратно докручиваем
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

	return {
		isOpen,
		toggle,
		close,
		closeAfter,
		handleKeyDown,
		triggerRef,
		panelRef
	}
}
