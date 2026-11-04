"use client"

import { PlusIcon } from "lucide-react"
import { AnimatePresence, m } from "motion/react"
import { type FC, memo, useCallback } from "react"
import { useFieldArray, useFormContext } from "react-hook-form"

import { Button } from "@/components/ui"
import { REQUEST_FORM_LIMITS } from "@/libs/constants/screens/request-form"
import { DURATION, EASE_OUT } from "@/libs/motion"
import type { CreateRequestFormFields } from "@/libs/schemes"

import { FieldError } from "./field-error"
import { RequestOriginRow } from "./request-origin-row"

const RequestOriginFieldsComponent: FC = () => {
	const { control, formState } = useFormContext<CreateRequestFormFields>()

	const { fields, append, remove } = useFieldArray({ control, name: "origin" })

	const isFull = fields.length >= REQUEST_FORM_LIMITS.ORIGIN_MAX_ITEMS

	// Фокус не переводим: на iOS клавиатура всё равно не откроется, а страница дёрнется
	const handleAdd = useCallback(
		() => append({ type: "email", value: "" }, { shouldFocus: false }),
		[append]
	)

	const groupError = (
		formState.errors.origin as { message?: string } | undefined
	)?.message

	return (
		<fieldset>
			<legend className="sr-only">Контакты клиента</legend>

			<div className="mb-2 flex items-center justify-between px-1 text-sm">
				<span className="text-on-surface/70">Контакты</span>

				<span className="text-on-surface-variant text-xs tabular-nums">
					{fields.length}/{REQUEST_FORM_LIMITS.ORIGIN_MAX_ITEMS}
				</span>
			</div>

			{/*
				Каждая строка сама раскрывается/сворачивается по высоте (вместе со своим
				нижним отступом), поэтому всё, что ниже, сдвигается плавно, без рывка.
			*/}
			<AnimatePresence initial={false}>
				{fields.map((field, index) => (
					<m.div
						key={field.id}
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: DURATION.base, ease: EASE_OUT }}
						className="overflow-hidden px-0.5"
					>
						<div className="pb-3">
							<RequestOriginRow index={index} onRemove={remove} />
						</div>
					</m.div>
				))}
			</AnimatePresence>

			<FieldError message={groupError} />

			<Button
				variant="default-2"
				className="gap-1 p-2"
				disabled={isFull}
				onClick={handleAdd}
			>
				<PlusIcon size={18} />
				Добавить контакт
			</Button>
		</fieldset>
	)
}

export const RequestOriginFields = memo(RequestOriginFieldsComponent)
RequestOriginFields.displayName = "RequestOriginFields"
