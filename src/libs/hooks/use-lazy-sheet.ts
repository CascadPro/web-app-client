"use client"

import { type ComponentType, useCallback, useState } from "react"

import { toast } from "@/components/ui/toast"

/**
 * Общий промис на чанк: файл скачивается ровно один раз,
 * сколько бы раз и откуда его ни просили.
 */
export const createLazyLoader = <T>(importer: () => Promise<T>) => {
	let promise: Promise<T> | null = null

	return (): Promise<T> => {
		promise ??= importer().catch((error: unknown) => {
			promise = null

			throw error
		})

		return promise
	}
}

/** Два кадра: шторка гарантированно смонтирована и отрисована в закрытом состоянии */
const nextPaint = () =>
	new Promise<void>(resolve =>
		requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
	)

/**
 * Ленивая шторка. Важно: она всегда монтируется *закрытой* и только потом
 * открывается. Если смонтировать сразу с open=true, AnimatePresence внутри
 * BottomSheet пропустит анимацию выезда.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useLazySheet = <T extends ComponentType<any>>(
	load: () => Promise<T>
) => {
	const [Sheet, setSheet] = useState<T | null>(null)
	const [isOpen, setIsOpen] = useState(false)
	const [isLoading, setIsLoading] = useState(false)

	const preload = useCallback(() => {
		load()
			// setState от функции-компонента — только через «() => component»
			.then(component => setSheet(() => component))
			.catch(() => {})
	}, [load])

	const open = useCallback(async () => {
		if (isLoading) return

		// Не успели предзагрузить — грузим по нажатию
		if (!Sheet) {
			setIsLoading(true)

			try {
				const component = await load()

				setSheet(() => component)

				await nextPaint()
			} catch {
				toast.error("Не удалось загрузить форму", {
					description: "Проверьте соединение и попробуйте ещё раз"
				})

				return
			} finally {
				setIsLoading(false)
			}
		}

		setIsOpen(true)
	}, [Sheet, isLoading, load])

	const close = useCallback(() => setIsOpen(false), [])

	return { Sheet, isOpen, isLoading, setIsOpen, open, close, preload }
}
