"use client"

import {
	CheckCircleIcon,
	InfoIcon,
	type LucideIcon,
	PencilIcon,
	XCircleIcon
} from "lucide-react"
import { useCallback, useMemo } from "react"

import type { DomainRequestStatus } from "@/api/generated"
import { toast, TOAST_ERROR_DURATION } from "@/components/ui/toast"
import { useRequestPatchStatus } from "@/libs/query/hooks/use-requests"
import { errorCatch } from "@/libs/utils"

export type RequestActionTone = "default" | "success" | "error"

export interface RequestCardAction {
	key: "details" | "edit" | "approve" | "reject"
	title: string
	Icon: LucideIcon
	tone: RequestActionTone
	loading: boolean
	disabled: boolean
	/** Пояснение под названием: почему действие недоступно */
	hint?: string
	onClick: () => void
}

interface Options {
	status?: DomainRequestStatus
	onDetails: () => void
	onEdit: () => void
	/** Действие со статусом выполнено — карточку можно «опустить» */
	onDone: () => void
}

export const useRequestCardActions = (
	id: string,
	{ status, onDetails, onEdit, onDone }: Options
): RequestCardAction[][] => {
	const { patchStatus, isPending, pendingStatus } = useRequestPatchStatus(id)

	const updateStatus = useCallback(
		async (next: "approve" | "reject") => {
			try {
				await patchStatus(next)

				toast.success(`Заявка ${next === "approve" ? "одобрена" : "отклонена"}`)

				onDone()
			} catch (error) {
				const { message: description, code } = errorCatch(error)

				const title = `Не удалось ${
					next === "approve" ? "одобрить" : "отклонить"
				} заявку`

				// «Не хватает полей» — не сбой, а подсказка, что нужно дозаполнить
				if (code === "request_not_enough_fields") {
					toast.info(title, { description })
					return
				}

				toast.error(title, { description, duration: TOAST_ERROR_DURATION })
			}
		},
		[patchStatus, onDone]
	)

	return useMemo<RequestCardAction[][]>(
		() => [
			[
				{
					key: "details",
					title: "Подробнее",
					Icon: InfoIcon,
					tone: "default",
					loading: false,
					disabled: isPending,
					onClick: onDetails
				},
				{
					key: "edit",
					title: "Изменить",
					Icon: PencilIcon,
					tone: "default",
					loading: false,
					disabled: isPending,
					onClick: onEdit
				}
			],
			[
				{
					key: "approve",
					title: "Подтвердить",
					Icon: CheckCircleIcon,
					tone: "success",
					loading: pendingStatus === "approve",
					disabled: isPending || status === "approved",
					hint: status === "approved" ? "Уже одобрена" : undefined,
					onClick: () => void updateStatus("approve")
				},
				{
					key: "reject",
					title: "Отклонить",
					Icon: XCircleIcon,
					tone: "error",
					loading: pendingStatus === "reject",
					disabled: isPending || status === "rejected",
					hint: status === "rejected" ? "Уже отклонена" : undefined,
					onClick: () => void updateStatus("reject")
				}
			]
		],
		[isPending, pendingStatus, status, onDetails, onEdit, updateStatus]
	)
}
