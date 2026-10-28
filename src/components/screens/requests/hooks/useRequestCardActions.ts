import {
	CheckCircleIcon,
	type LucideIcon,
	MoreHorizontalIcon,
	XCircleIcon
} from "lucide-react"
import { useCallback, useMemo } from "react"

import { toast, TOAST_ERROR_DURATION } from "@/components/ui/toast"
import { useRequestPatchStatus } from "@/libs/query/hooks/use-requests"
import { errorCatch } from "@/libs/utils"

interface Action {
	key: string
	title: string
	Icon: LucideIcon
	onClick: () => void
	loading: boolean
}

interface UseRequestCardActionsReturn {
	actions: Action[]
	disabled: boolean
}

export const useRequestCardActions = (
	id: string,
	handleCollapse: () => void
): UseRequestCardActionsReturn => {
	const { patchStatus, isPending } = useRequestPatchStatus(id)

	const updateStatus = useCallback(
		async (status: "approve" | "reject") => {
			const toastId = toast.loading("Пожалуйста, подождите...", {
				dismissible: false
			})

			try {
				await patchStatus(status)

				toast.update(toastId, {
					type: "success",
					title: `Запрос успешно ${
						status === "approve" ? "одобрен" : "отклонен"
					}`
				})
			} catch (error) {
				const { message: description, code } = errorCatch(error)

				toast.update(toastId, {
					type: code === "request_not_enough_fields" ? "info" : "error",
					title: `Не удалось ${
						status === "approve" ? "одобрить" : "отклонить"
					} запрос`,
					description,
					duration: TOAST_ERROR_DURATION
				})
			}
		},
		[patchStatus]
	)

	const approveRequest = useCallback(
		() => updateStatus("approve"),
		[updateStatus]
	)

	const rejectRequest = useCallback(
		() => updateStatus("reject"),
		[updateStatus]
	)

	const actions = useMemo<Action[]>(
		() => [
			{
				key: "details",
				title: "Подробнее",
				Icon: MoreHorizontalIcon,
				loading: false,
				onClick: handleCollapse
			},
			{
				key: "approve",
				title: "Подтвердить",
				Icon: CheckCircleIcon,
				loading: isPending,
				onClick: approveRequest
			},
			{
				key: "reject",
				title: "Отклонить",
				Icon: XCircleIcon,
				loading: isPending,
				onClick: rejectRequest
			}
		],
		[handleCollapse, isPending, approveRequest, rejectRequest]
	)

	return {
		actions,
		disabled: isPending
	}
}
