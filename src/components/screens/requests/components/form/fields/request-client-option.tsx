"use client"

import { BuildingIcon, CheckIcon } from "lucide-react"
import { type FC, memo } from "react"

import {
	type ClientListItem,
	formatClientContacts,
	getClientTitle
} from "@/libs/utils/screens/clients/normalize"

interface Props {
	client: ClientListItem
	selected: boolean
	onSelect: (client: ClientListItem) => void
}

/** Одна строка в списке клиентов: название и контакты */
const RequestClientOptionComponent: FC<Props> = ({
	client,
	selected,
	onSelect
}) => {
	const contacts = formatClientContacts(client.contacts)

	return (
		<button
			type="button"
			data-option
			onClick={() => onSelect(client)}
			aria-current={selected || undefined}
			className="active:bg-primary/10 focus-visible:bg-primary/10 flex min-h-14 w-full items-center gap-3 px-3 py-2 text-left transition-colors outline-none motion-reduce:transition-none"
		>
			<span className="bg-primary/10 text-primary grid size-9 shrink-0 place-items-center rounded-lg">
				<BuildingIcon size={18} aria-hidden />
			</span>

			<span className="min-w-0 flex-1">
				<span className="block truncate text-sm font-medium">
					{getClientTitle(client)}
				</span>

				{contacts && (
					<span className="text-on-surface-variant block truncate text-xs">
						{contacts}
					</span>
				)}
			</span>

			{selected && (
				<>
					<CheckIcon
						size={18}
						aria-hidden
						className="text-primary animate-pop shrink-0"
					/>

					<span className="sr-only">Выбран</span>
				</>
			)}
		</button>
	)
}

export const RequestClientOption = memo(RequestClientOptionComponent)
RequestClientOption.displayName = "RequestClientOption"
