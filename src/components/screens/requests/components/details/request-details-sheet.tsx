"use client"

import { PencilIcon } from "lucide-react"
import { type FC, memo } from "react"

import { BottomSheet, Button } from "@/components/ui"
import { useRequestDetail } from "@/libs/query/hooks/use-requests"

import { RequestSheetError } from "../request-sheet-error"

import { RequestDetailsContent } from "./request-details-content"
import { RequestDetailsSkeleton } from "./request-details-skeleton"

interface Props {
	id: string
	open: boolean
	onOpenChange: (open: boolean) => void
	/** «Изменить» из подробностей: родитель закрывает эту шторку и открывает редактирование */
	onEdit: () => void
}

const RequestDetailsSheetComponent: FC<Props> = ({
	id,
	open,
	onOpenChange,
	onEdit
}) => {
	const { request, isPending, isError, isFetching, refetch } = useRequestDetail(
		id,
		open
	)

	return (
		<BottomSheet
			open={open}
			onChange={onOpenChange}
			zIndex={8890}
			title="Подробнее"
			titleCN="px-1"
			panelCN="min-h-[60dvh]"
			className="flex-1 overflow-x-hidden pb-4"
			footer={
				<Button
					className="w-full gap-2 p-3"
					disabled={!request}
					onClick={onEdit}
				>
					<PencilIcon size={18} aria-hidden />
					Изменить заявку
				</Button>
			}
		>
			{request ? (
				<RequestDetailsContent request={request} requestId={id} />
			) : isError ? (
				<RequestSheetError
					onRetry={() => void refetch()}
					isRetrying={isFetching}
				/>
			) : isPending ? (
				<RequestDetailsSkeleton />
			) : null}
		</BottomSheet>
	)
}

export const RequestDetailsSheet = memo(RequestDetailsSheetComponent)
RequestDetailsSheet.displayName = "RequestDetailsSheet"
