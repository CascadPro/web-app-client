"use client"

import { useQueryClient } from "@tanstack/react-query"
import { BuildingIcon, ChevronDownIcon, XIcon } from "lucide-react"
import { AnimatePresence, m } from "motion/react"
import { type FC, memo, useCallback, useId } from "react"
import { useController, useFormContext } from "react-hook-form"

import { Skeleton } from "@/components/ui"
import { DURATION, EASE_OUT, SPRING } from "@/libs/motion"
import { useClient } from "@/libs/query/hooks/use-clients"
import { QueryKeys } from "@/libs/query/keys"
import type { CreateRequestFormFields } from "@/libs/schemes"
import { cn } from "@/libs/utils"
import {
	type ClientListItem,
	formatClientContacts,
	getClientTitle
} from "@/libs/utils/screens/clients/normalize"

import { useInlinePanel } from "../../../hooks/useInlinePanel"

import { FieldError } from "./field-error"
import { RequestClientSearch } from "./request-client-search"

const CLOSE_DELAY = 160

interface Props {
	clearable?: boolean
}

/**
 * Заказчик заявки. В форме хранится только id: название и контакты
 * подтягиваются отдельным запросом по этому id (useClient).
 */
const RequestClientFieldComponent: FC<Props> = ({ clearable = true }) => {
	const id = useId()
	const labelId = `${id}-label`
	const valueId = `${id}-value`
	const panelId = `${id}-panel`
	const messageId = `${id}-message`

	const queryClient = useQueryClient()
	const { control, formState } = useFormContext<CreateRequestFormFields>()
	const { field } = useController({ control, name: "client_id" })

	const panel = useInlinePanel({ onClose: field.onBlur })
	const { closeAfter, triggerRef } = panel

	const clientId = field.value
	const error = formState.errors.client_id?.message

	const { data: client, isLoading, isError } = useClient(clientId)

	const handleSelect = useCallback(
		(picked: ClientListItem) => {
			if (!picked.id) return

			// Подпись выбранного берём из уже загруженного списка, без лишнего запроса
			queryClient.setQueryData(QueryKeys.clients.detail(picked.id), picked)

			field.onChange(picked.id)
			closeAfter(CLOSE_DELAY)
		},
		[queryClient, field, closeAfter]
	)

	const handleClear = useCallback(() => {
		field.onChange("")
		triggerRef.current?.focus()
	}, [field, triggerRef])

	const contacts = formatClientContacts(client?.contacts)

	let valueNode

	if (!clientId) {
		valueNode = <span className="text-on-surface-variant">Не выбран</span>
	} else if (isLoading) {
		valueNode = <Skeleton className="h-5 w-40" />
	} else if (isError || !client) {
		valueNode = <span className="text-error">Заказчик недоступен</span>
	} else {
		valueNode = (
			<>
				<span className="block truncate">{getClientTitle(client)}</span>

				{contacts && (
					<span className="text-on-surface-variant block truncate text-xs">
						{contacts}
					</span>
				)}
			</>
		)
	}

	return (
		<div>
			<span id={labelId} className="text-on-surface/70 mb-2 block px-1 text-sm">
				Заказчик
			</span>

			<div className="relative">
				<button
					ref={panel.triggerRef}
					type="button"
					aria-expanded={panel.isOpen}
					aria-controls={panelId}
					aria-labelledby={`${labelId} ${valueId}`}
					aria-invalid={error ? true : undefined}
					aria-describedby={error ? messageId : undefined}
					onClick={panel.toggle}
					className={cn(
						"ring-outline/40 flex min-h-12 w-full items-center gap-2 rounded-xl py-2.5 pr-20 pl-3 text-left ring outline-none",
						"transition-shadow motion-reduce:transition-none",
						"focus-visible:ring-primary focus-visible:ring-2",
						panel.isOpen && "ring-primary ring-2",
						error && "ring-error"
					)}
				>
					<BuildingIcon
						size={18}
						aria-hidden
						className="text-on-surface-variant shrink-0"
					/>

					<span id={valueId} className="min-w-0 flex-1">
						{valueNode}
					</span>
				</button>

				<ChevronDownIcon
					size={18}
					aria-hidden
					className={cn(
						"text-on-surface-variant pointer-events-none absolute top-1/2 right-3 -translate-y-1/2",
						"transition-transform duration-200 motion-reduce:transition-none",
						panel.isOpen && "rotate-180"
					)}
				/>

				<AnimatePresence initial={false}>
					{clientId && clearable && (
						<m.button
							key="clear"
							type="button"
							aria-label="Убрать заказчика"
							onClick={handleClear}
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.8 }}
							transition={SPRING.snappy}
							className="hover:bg-secondary/40 absolute top-1/2 right-9 -translate-y-1/2 rounded-full p-1.5"
						>
							<XIcon size={16} />
						</m.button>
					)}
				</AnimatePresence>
			</div>

			<AnimatePresence initial={false}>
				{panel.isOpen && (
					<m.div
						key="panel"
						ref={panel.panelRef}
						id={panelId}
						role="group"
						aria-label="Выбор заказчика"
						onKeyDown={panel.handleKeyDown}
						initial={{ height: 0 }}
						animate={{ height: "auto" }}
						exit={{ height: 0 }}
						transition={{ duration: DURATION.slow, ease: EASE_OUT }}
						className="animate-fade-up overflow-hidden"
					>
						<div className="mt-3">
							<div className="bg-surface-variant/40 border-outline/20 rounded-2xl border p-(--mini-row-padding-x)">
								<RequestClientSearch
									active={panel.isOpen}
									selectedId={clientId}
									onSelect={handleSelect}
								/>
							</div>
						</div>
					</m.div>
				)}
			</AnimatePresence>

			<FieldError id={messageId} message={error} />
		</div>
	)
}

export const RequestClientField = memo(RequestClientFieldComponent)
RequestClientField.displayName = "RequestClientField"
