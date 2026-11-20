"use client"

import { RotateCcwIcon, SaveIcon } from "lucide-react"
import { type FC, memo } from "react"
import { FormProvider } from "react-hook-form"

import { BottomSheet } from "@/components/ui"
import {
	REQUEST_EDIT_FORM_ID,
	REQUEST_EDIT_SUBMIT_LABELS
} from "@/libs/constants/screens/requests/request-form"

import { useRequestEdit } from "../../hooks/useRequestEdit"
import { RequestFormFooter } from "../form/request-form-footer"
import { RequestSheetError } from "../request-sheet-error"

import { RequestEditForm } from "./request-edit-form"
import { RequestEditSkeleton } from "./request-edit-skeleton"

interface Props {
	id: string
	open: boolean
	onOpenChange: (open: boolean) => void
}

const RequestEditSheetComponent: FC<Props> = ({ id, open, onOpenChange }) => {
	const edit = useRequestEdit(id, open, onOpenChange)

	const { form, status } = edit

	const isDirty = form.formState.isDirty
	const isBusy = status === "loading" || status === "success"
	const isReady = !edit.isLoading && !edit.isError

	return (
		<BottomSheet
			open={open}
			onChange={edit.handleOpenChange}
			zIndex={8890}
			title="Изменить заявку"
			titleCN="px-1"
			panelCN="min-h-[85dvh]"
			className="flex-1 overflow-x-hidden pb-4"
			footer={
				isReady ? (
					<RequestFormFooter
						status={status}
						formId={REQUEST_EDIT_FORM_ID}
						submitLabels={REQUEST_EDIT_SUBMIT_LABELS}
						submitIcon={SaveIcon}
						submitDisabled={!isDirty}
						canReset={isDirty && !isBusy}
						resetLabel="Отменить изменения"
						resetIcon={RotateCcwIcon}
						onReset={edit.handleReset}
					/>
				) : null
			}
			dragAnywhere={false}
			closeOnBackdropClick={status !== "loading"}
		>
			{edit.isLoading ? (
				<RequestEditSkeleton />
			) : edit.isError ? (
				<RequestSheetError
					onRetry={() => void edit.refetch()}
					isRetrying={edit.isRefetching}
				/>
			) : (
				<FormProvider {...form}>
					<RequestEditForm
						onSubmit={edit.handleSubmit}
						deadlineMin={edit.deadlineMin}
						deadlineClearable={edit.deadlineClearable}
						clientClearable={edit.clientClearable}
					/>
				</FormProvider>
			)}
		</BottomSheet>
	)
}

export const RequestEditSheet = memo(RequestEditSheetComponent)
RequestEditSheet.displayName = "RequestEditSheet"
