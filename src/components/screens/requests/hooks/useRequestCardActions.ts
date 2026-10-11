import {
	CheckCircleIcon,
	LucideIcon,
	MoreHorizontalIcon,
	XCircleIcon
} from "lucide-react"
import { useCallback, useMemo } from "react"

import { Toast } from "@/components/ui"
import { useRequestPatchStatus } from "@/libs/query/hooks/use-requests"
import { errorCatch } from "@/libs/utils"

interface Action {
	key: string
	title: string
	Icon: LucideIcon

	onClick: () => void

	loading: boolean
}

export const useRequestCardActions = (
	id: string,
	handleCollapse: () => void
) => {
	const { approve, reject, isApproveLoading, isRejectLoading } =
		useRequestPatchStatus(id)

	const updateStatus = useCallback(
		async (status: "approve" | "reject") => {
			try {
				if (status === "approve") {
					await approve()
				} else {
					await reject()
				}
			} catch (error) {
				const { message, code } = errorCatch(error)

				const type = code === "request_not_enough_fields" ? "info" : "error"
				const title = `Не удалось ${status === "approve" ? "одобрить" : "отклонить"} запрос`

				Toast.show({
					type: type as any,
					text1: title,
					text2: message
				})
			}
		},
		[approve, reject]
	)

	const actions: Action[] = useMemo(
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
				loading: isApproveLoading,
				onClick: () => updateStatus("approve")
			},
			{
				key: "reject",
				title: "Отклонить",
				Icon: XCircleIcon,
				loading: isRejectLoading,
				onClick: () => updateStatus("reject")
			}
		],
		[isApproveLoading, isRejectLoading, handleCollapse]
	)

	return {
		actions,
		disabled: isApproveLoading || isRejectLoading
	}
}
