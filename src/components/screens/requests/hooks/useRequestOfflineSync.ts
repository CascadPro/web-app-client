"use client"

import { useEffect, useRef } from "react"

import { toast, TOAST_SUCCESS_DURATION } from "@/components/ui/toast"
import { useCreateRequest } from "@/libs/query/hooks/use-requests"
import { flushRequestQueue } from "@/libs/utils/screens/request-create"

/**
 * Отправляет заявки, созданные без сети. Запускается при открытии экрана
 * и каждый раз, когда браузер сообщает, что связь вернулась.
 * Повторная отправка безопасна: у каждой заявки свой Idempotency-Key.
 */
export const useRequestOfflineSync = (): void => {
	const { mutateAsync } = useCreateRequest()

	const sendRef = useRef(mutateAsync)

	useEffect(() => {
		sendRef.current = mutateAsync
	}, [mutateAsync])

	useEffect(() => {
		const flush = async () => {
			if (!navigator.onLine) return

			const { sent, failed } = await flushRequestQueue(item =>
				sendRef.current({ body: item.body, idempotencyKey: item.key })
			)

			if (sent > 0) {
				toast.success(
					sent === 1 ? "Заявка отправлена" : `Отправлено заявок: ${sent}`,
					{ duration: TOAST_SUCCESS_DURATION }
				)
			}

			if (failed > 0) {
				toast.error(`Не удалось отправить заявок: ${failed}`, {
					description: "Сервер отклонил данные. Создайте заявку заново"
				})
			}
		}

		void flush()

		window.addEventListener("online", flush)

		return () => window.removeEventListener("online", flush)
	}, [])
}
