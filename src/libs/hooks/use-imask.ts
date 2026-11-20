"use client"

import IMask from "imask"
import { useCallback, useEffect, useRef } from "react"

type MaskOptions = Parameters<typeof IMask>[1]
type MaskInstance = ReturnType<typeof IMask>

interface Options {
	/** Настройки imask. Передавайте стабильный объект (константу) */
	options: MaskOptions
	/** Текущее значение формы (в виде с маской) */
	value: string
	/** Значение изменилось: пользователь ввёл символ или imask переформатировал текст */
	onAccept: (value: string) => void
}

/**
 * Подключает imask к <input>: маска живёт, пока элемент на странице, а значение
 * синхронизируется с формой в обе стороны. Возвращает ref для input.
 * (Только core-пакет imask: react-imask не нужен.)
 */
export const useIMask = ({ options, value, onAccept }: Options) => {
	const optionsRef = useRef(options)
	const valueRef = useRef(value)
	const onAcceptRef = useRef(onAccept)
	const maskRef = useRef<MaskInstance | null>(null)

	useEffect(() => {
		valueRef.current = value
		onAcceptRef.current = onAccept
	})

	const attach = useCallback((element: HTMLInputElement | null) => {
		maskRef.current?.destroy()
		maskRef.current = null

		if (!element) return

		const mask = IMask(element, optionsRef.current)

		mask.value = valueRef.current

		// Старое значение (черновик, данные другого формата) imask мог переформатировать —
		// сообщаем форме, чтобы она хранила то же, что видит пользователь
		if (mask.value !== valueRef.current) onAcceptRef.current(mask.value)

		mask.on("accept", () => {
			if (mask.value !== valueRef.current) onAcceptRef.current(mask.value)
		})

		maskRef.current = mask
	}, [])

	// Значение изменили снаружи (reset формы, восстановление черновика)
	useEffect(() => {
		const mask = maskRef.current

		if (mask && mask.value !== value) mask.value = value
	}, [value])

	return attach
}
