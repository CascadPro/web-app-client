"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
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
} from "@/libs/constants/screens/requests/request-form"
import { useHaptic } from "@/libs/haptics"
import {
	useRequestDetail,
	useUpdateRequest
} from "@/libs/query/hooks/use-requests"
import { QueryKeys } from "@/libs/query/keys"
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
	const queryClient = useQueryClient()

	const initial = useMemo(
		() => (request ? requestToFormValues(request) : null),
		[request]
	)

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

	const requestClient = request?.client

	useEffect(() => {
		const clientId = requestClient?.id

		if (!clientId || !requestClient) return

		const key = QueryKeys.clients.detail(clientId)

		if (!queryClient.getQueryData(key))
			queryClient.setQueryData(key, requestClient)
	}, [requestClient, queryClient])

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
		deadlineMin:
			initial?.deadline && initial.deadline < today
				? initial.deadline
				: undefined,
		deadlineClearable: !initial?.deadline,
		clientClearable: !initial?.client_id,
		handleSubmit: form.handleSubmit(submit) as (
			event?: BaseSyntheticEvent
		) => Promise<void>,
		handleReset,
		handleOpenChange
	}
}
