"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import type { BaseSyntheticEvent } from "react"
import { useCallback, useEffect, useRef, useState } from "react"
import type { UseFormReturn } from "react-hook-form"
import { useForm } from "react-hook-form"

import {
	toast,
	TOAST_ERROR_DURATION,
	TOAST_SUCCESS_DURATION
} from "@/components/ui/toast"
import {
	REQUEST_CREATE_ERROR_RESET_DELAY,
	REQUEST_CREATE_SUCCESS_DELAY
} from "@/libs/constants/screens/requests/request-form"
import { useHaptic } from "@/libs/haptics"
import { useReduceMotion } from "@/libs/motion"
import { useCreateRequest } from "@/libs/query/hooks/use-requests"
import { createIdempotencyKey } from "@/libs/query/idempotency"
import {
	createRequestDefaults,
	type CreateRequestFormFields,
	createRequestScheme
} from "@/libs/schemes"
import { errorCatch } from "@/libs/utils"
import {
	clearRequestDraft,
	enqueueRequest,
	isOffline,
	scrollToRequestList,
	toCreateRequestPayload
} from "@/libs/utils/screens/request-create"
import { useRequestContext } from "../requests-context"
import type { RequestCreateStatus } from "@/types/screens/requests"

import { applyServerFieldErrors } from "./applyServerFieldErrors"
import { useRequestDraft } from "./useRequestDraft"

interface UseRequestCreateReturn {
	form: UseFormReturn<CreateRequestFormFields>
	status: RequestCreateStatus
	isDraftRestored: boolean
	dismissDraftNotice: () => void
	handleSubmit: (event?: BaseSyntheticEvent) => Promise<void>
	handleReset: () => void
	handleOpenChange: (open: boolean) => void
}

export const useRequestCreate = (
	open: boolean,
	onOpenChange: (open: boolean) => void
): UseRequestCreateReturn => {
	const form = useForm<CreateRequestFormFields>({
		resolver: zodResolver(createRequestScheme),
		defaultValues: createRequestDefaults,
		mode: "onBlur"
	})

	const { mutateAsync } = useCreateRequest()
	const { haptic } = useHaptic()
	const reduceMotion = useReduceMotion()
	const { highlight } = useRequestContext()

	const { isRestored, dismissRestored } = useRequestDraft(form, open)

	const [status, setStatus] = useState<RequestCreateStatus>("default")

	const attemptRef = useRef<{ key: string; fingerprint: string } | null>(null)
	const busyRef = useRef(false)
	const timersRef = useRef(new Set<ReturnType<typeof setTimeout>>())

	const later = useCallback((callback: () => void, delay: number) => {
		const timer = setTimeout(() => {
			timersRef.current.delete(timer)
			callback()
		}, delay)

		timersRef.current.add(timer)
	}, [])

	useEffect(() => {
		const timers = timersRef.current

		return () => {
			timers.forEach(clearTimeout)
			timers.clear()
		}
	}, [])

	const finish = useCallback(
		(next: "success" | "queued", createdId?: string) => {
			setStatus(next)

			later(() => {
				onOpenChange(false)
				form.reset(createRequestDefaults)

				attemptRef.current = null
				busyRef.current = false

				setStatus("default")

				later(() => {
					if (createdId) highlight(createdId)

					scrollToRequestList(reduceMotion)
				}, 350)
			}, REQUEST_CREATE_SUCCESS_DELAY)
		},
		[form, highlight, later, onOpenChange, reduceMotion]
	)

	const submit = useCallback(
		async (values: CreateRequestFormFields) => {
			if (busyRef.current) return

			busyRef.current = true

			const body = toCreateRequestPayload(values)
			const fingerprint = JSON.stringify(body)

			if (attemptRef.current?.fingerprint !== fingerprint) {
				attemptRef.current = { key: createIdempotencyKey(), fingerprint }
			}

			const idempotencyKey = attemptRef.current.key

			const saveToQueue = async () => {
				try {
					await enqueueRequest({
						key: idempotencyKey,
						body,
						createdAt: Date.now()
					})
					await clearRequestDraft()

					toast.info("Заявка сохранена", {
						description: "Она отправится, как только появится сеть",
						duration: TOAST_SUCCESS_DURATION
					})

					finish("queued")
				} catch {
					busyRef.current = false

					toast.error("Не удалось сохранить заявку", {
						duration: TOAST_ERROR_DURATION
					})
				}
			}

			if (isOffline()) {
				await saveToQueue()
				return
			}

			setStatus("loading")

			const toastId = toast.loading("Создаём заявку...", { dismissible: false })

			try {
				const created = await mutateAsync({ body, idempotencyKey })

				toast.update(toastId, {
					type: "success",
					title: "Заявка создана",
					duration: TOAST_SUCCESS_DURATION
				})

				void clearRequestDraft()

				finish("success", created.id)
			} catch (error) {
				if (isOffline()) {
					toast.dismiss(toastId)
					await saveToQueue()
					return
				}

				const { message, fields, code } = errorCatch(error)

				if (code === "idempotency_key_reused") attemptRef.current = null

				applyServerFieldErrors(form, fields)

				haptic("medium")

				toast.update(toastId, {
					type: "error",
					title: "Не удалось создать заявку",
					description: message,
					duration: TOAST_ERROR_DURATION
				})

				busyRef.current = false

				setStatus("error")
				later(() => setStatus("default"), REQUEST_CREATE_ERROR_RESET_DELAY)
			}
		},
		[finish, form, haptic, later, mutateAsync]
	)

	const handleReset = useCallback(() => {
		form.reset(createRequestDefaults)

		attemptRef.current = null

		void clearRequestDraft()
	}, [form])

	const handleOpenChange = useCallback(
		(next: boolean) => {
			if (!next && status === "loading") return

			onOpenChange(next)
		},
		[onOpenChange, status]
	)

	return {
		form,
		status,
		isDraftRestored: isRestored,
		dismissDraftNotice: dismissRestored,
		handleSubmit: form.handleSubmit(submit),
		handleReset,
		handleOpenChange
	}
}
