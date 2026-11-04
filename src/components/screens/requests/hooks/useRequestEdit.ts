"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import {
	type BaseSyntheticEvent,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState
} from "react"
import { useForm } from "react-hook-form"

import {
	toast,
	TOAST_ERROR_DURATION,
	TOAST_SUCCESS_DURATION
} from "@/components/ui/toast"
import {
	REQUEST_CREATE_ERROR_RESET_DELAY,
	REQUEST_CREATE_SUCCESS_DELAY
} from "@/libs/constants/screens/request-form"
import { useHaptic } from "@/libs/haptics"
import {
	useRequestDetail,
	useUpdateRequest
} from "@/libs/query/hooks/use-requests"
import {
	createRequestDefaults,
	type CreateRequestFormFields,
	makeRequestScheme
} from "@/libs/schemes"
import { errorCatch } from "@/libs/utils"
import { getTodayISO, isOffline } from "@/libs/utils/screens/request-create"
import {
	buildPatchPayload,
	hasPatchChanges,
	requestToFormValues
} from "@/libs/utils/screens/request-edit"
import type { RequestCreateStatus } from "@/types/screens/requests"

import { applyServerFieldErrors } from "./applyServerFieldErrors"
import { useLater } from "./useLater"

export const useRequestEdit = (
	id: string,
	open: boolean,
	onOpenChange: (open: boolean) => void
) => {
	const { request, isPending, isError, isFetching, refetch } = useRequestDetail(
		id,
		open
	)
	const { mutateAsync } = useUpdateRequest(id)
	const { haptic } = useHaptic()
	const later = useLater()

	const initial = useMemo(
		() => (request ? requestToFormValues(request) : null),
		[request]
	)

	// Сохранённый срок можно оставить как есть, даже если он уже в прошлом
	const scheme = useMemo(
		() => makeRequestScheme(initial?.deadline),
		[initial?.deadline]
	)

	const form = useForm<CreateRequestFormFields>({
		resolver: zodResolver(scheme),
		defaultValues: createRequestDefaults,
		mode: "onBlur"
	})

	const [status, setStatus] = useState<RequestCreateStatus>("default")
	const busyRef = useRef(false)
	const wasOpenRef = useRef(false)

	// Каждое открытие начинается с актуальных данных заявки (несохранённое прошлое
	// редактирование отбрасывается). Пока шторка открыта, фоновое обновление с сервера
	// не затирает то, что пользователь уже ввёл.
	useEffect(() => {
		if (!initial) return

		if (open && !wasOpenRef.current) {
			form.reset(initial)
		} else if (open) {
			form.reset(initial, { keepDirtyValues: true })
		}

		wasOpenRef.current = open
	}, [open, initial, form])

	const submit = useCallback(
		async (values: CreateRequestFormFields) => {
			if (busyRef.current || !initial) return

			const body = buildPatchPayload(initial, values)

			// Ничего не изменилось — просто закрываем
			if (!hasPatchChanges(body)) {
				onOpenChange(false)
				return
			}

			if (isOffline()) {
				toast.error("Нет соединения", {
					description: "Изменения нельзя сохранить без сети",
					duration: TOAST_ERROR_DURATION
				})
				return
			}

			busyRef.current = true
			setStatus("loading")

			const toastId = toast.loading("Сохраняем изменения...", {
				dismissible: false
			})

			try {
				await mutateAsync(body)

				toast.update(toastId, {
					type: "success",
					title: "Изменения сохранены",
					duration: TOAST_SUCCESS_DURATION
				})

				setStatus("success")

				later(() => {
					onOpenChange(false)
					setStatus("default")
					busyRef.current = false
				}, REQUEST_CREATE_SUCCESS_DELAY)
			} catch (error) {
				const { message, fields } = errorCatch(error)

				applyServerFieldErrors(form, fields)

				haptic("medium")

				toast.update(toastId, {
					type: "error",
					title: "Не удалось сохранить",
					description: message,
					duration: TOAST_ERROR_DURATION
				})

				busyRef.current = false

				setStatus("error")
				later(() => setStatus("default"), REQUEST_CREATE_ERROR_RESET_DELAY)
			}
		},
		[initial, form, haptic, later, mutateAsync, onOpenChange]
	)

	const handleReset = useCallback(() => {
		if (initial) form.reset(initial)
	}, [form, initial])

	const handleOpenChange = useCallback(
		(next: boolean) => {
			// Пока изменения отправляются, шторку не закрываем
			if (!next && status === "loading") return

			onOpenChange(next)
		},
		[onOpenChange, status]
	)

	const today = useMemo(getTodayISO, [])

	return {
		form,
		request,
		status,
		isLoading: isPending && !request,
		isError: isError && !request,
		isRefetching: isFetching,
		refetch,
		/** Просроченный срок остаётся доступным для выбора, пока его не поменяли */
		deadlineMin:
			initial?.deadline && initial.deadline < today
				? initial.deadline
				: undefined,
		/** Уже сохранённый срок стереть нельзя — API не умеет «обнулять» его */
		deadlineClearable: !initial?.deadline,
		handleSubmit: form.handleSubmit(submit) as (
			event?: BaseSyntheticEvent
		) => Promise<void>,
		handleReset,
		handleOpenChange
	}
}
