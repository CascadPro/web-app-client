"use client"

import { Trash2Icon } from "lucide-react"
import { type FC, memo } from "react"
import { FormProvider } from "react-hook-form"

import { BottomSheet } from "@/components/ui"
import {
	REQUEST_CREATE_FORM_ID,
	REQUEST_CREATE_SUBMIT_LABELS
} from "@/libs/constants/screens/request-form"

import { useRequestCreate } from "../../hooks/useRequestCreate"
import { RequestFormFooter } from "../form/request-form-footer"

import { RequestCreateForm } from "./request-create-form"

interface Props {
	open: boolean
	onOpenChange: (open: boolean) => void
}

const RequestCreateSheetComponent: FC<Props> = ({ open, onOpenChange }) => {
	const {
		form,
		status,
		isDraftRestored,
		dismissDraftNotice,
		handleSubmit,
		handleReset,
		handleOpenChange
	} = useRequestCreate(open, onOpenChange)

	const isBusy = status === "loading" || status === "success"
	const canReset = (form.formState.isDirty || isDraftRestored) && !isBusy

	return (
		<BottomSheet
			open={open}
			onChange={handleOpenChange}
			zIndex={8890}
			title="Новая заявка"
			titleCN="px-1"
			// Высота шторки не зависит от количества полей: ничего не «подпрыгивает»,
			// а лишнее содержимое прокручивается
			panelCN="min-h-[85dvh]"
			className="flex-1 overflow-x-hidden pb-4"
			footer={
				<RequestFormFooter
					status={status}
					formId={REQUEST_CREATE_FORM_ID}
					submitLabels={REQUEST_CREATE_SUBMIT_LABELS}
					canReset={canReset}
					resetLabel="Очистить форму"
					resetIcon={Trash2Icon}
					onReset={handleReset}
				/>
			}
			// Закрываем только за «ручку» и по фону: жесты в полях не сворачивают шторку
			dragAnywhere={false}
			closeOnBackdropClick={status !== "loading"}
		>
			<FormProvider {...form}>
				<RequestCreateForm
					isDraftRestored={isDraftRestored}
					onSubmit={handleSubmit}
					onDismissDraftNotice={dismissDraftNotice}
				/>
			</FormProvider>
		</BottomSheet>
	)
}

export const RequestCreateSheet = memo(RequestCreateSheetComponent)
RequestCreateSheet.displayName = "RequestCreateSheet"
