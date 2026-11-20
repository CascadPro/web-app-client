"use client"

import { Loader2Icon, SearchIcon, XIcon } from "lucide-react"
import { type FC, type KeyboardEvent, useEffect, useId, useRef } from "react"

import { Input, Skeleton } from "@/components/ui"
import { cn } from "@/libs/utils"
import type { ClientListItem } from "@/libs/utils/screens/clients/normalize"

import { useClientSearch } from "../../../hooks/useClientSearch"
import { RequestSheetError } from "../../request-sheet-error"

import { RequestClientOption } from "./request-client-option"

interface Props {
	/** Панель раскрыта: запросы идут только пока она открыта */
	active: boolean
	selectedId: string
	onSelect: (client: ClientListItem) => void
}

/** Поиск клиента по названию (с задержкой) и выбор из списка */
export const RequestClientSearch: FC<Props> = ({
	active,
	selectedId,
	onSelect
}) => {
	const listId = useId()

	const search = useClientSearch(active)
	const { reset } = search

	const inputRef = useRef<HTMLInputElement>(null)
	const listRef = useRef<HTMLUListElement>(null)

	// При открытии — в поле поиска, при закрытии — чистим запрос
	useEffect(() => {
		if (!active) reset()
	}, [active, reset])

	const getOptions = (): HTMLButtonElement[] =>
		listRef.current
			? Array.from(
					listRef.current.querySelectorAll<HTMLButtonElement>(
						"button[data-option]"
					)
				)
			: []

	const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
		// Enter в поле поиска не должен отправлять всю форму
		if (event.key === "Enter") {
			event.preventDefault()
			return
		}

		if (event.key === "ArrowDown") {
			event.preventDefault()
			getOptions()[0]?.focus()
		}
	}

	const handleListKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
		const options = getOptions()
		const index = options.findIndex(option => option === document.activeElement)

		let target: HTMLElement | undefined

		switch (event.key) {
			case "ArrowDown":
				target = options[Math.min(index + 1, options.length - 1)]
				break
			case "ArrowUp":
				target =
					index <= 0 ? (inputRef.current ?? undefined) : options[index - 1]
				break
			case "Home":
				target = options[0]
				break
			case "End":
				target = options[options.length - 1]
				break
			default:
				return
		}

		event.preventDefault()
		target?.focus()
	}

	const { clients, total, searchedQuery, isSearching } = search

	const statusText = isSearching
		? "Поиск…"
		: clients.length > 0
			? `Найдено: ${total ?? clients.length}`
			: "Ничего не найдено"

	let content

	if (search.isError) {
		content = (
			<RequestSheetError
				compact
				title="Не удалось загрузить клиентов"
				isRetrying={isSearching}
				onRetry={() => void search.refetch()}
			/>
		)
	} else if (search.isLoading) {
		content = (
			<div className="flex flex-col gap-2" aria-busy="true">
				{[0, 1, 2].map(row => (
					<Skeleton key={row} className="h-14 rounded-xl" />
				))}
			</div>
		)
	} else if (clients.length === 0) {
		content = (
			<p className="text-on-surface-variant px-2 py-6 text-center text-sm">
				{searchedQuery
					? `Ничего не найдено по запросу «${searchedQuery}»`
					: "Клиентов пока нет"}
			</p>
		)
	} else {
		content = (
			<ul
				id={listId}
				ref={listRef}
				onKeyDown={handleListKeyDown}
				className={cn(
					"divide-outline/15 border-outline/20 bg-surface/60 max-h-58 divide-y overflow-y-auto overscroll-contain rounded-2xl border",
					"transition-opacity duration-150 motion-reduce:transition-none",
					isSearching && "opacity-60"
				)}
			>
				{clients.map(client => (
					<li key={client.id}>
						<RequestClientOption
							client={client}
							selected={Boolean(client.id) && client.id === selectedId}
							onSelect={onSelect}
						/>
					</li>
				))}
			</ul>
		)
	}

	return (
		<div className="flex flex-col gap-(--card-gap)">
			<div className="relative">
				<SearchIcon
					size={18}
					aria-hidden
					className="text-on-surface-variant pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
				/>

				<Input
					ref={inputRef}
					type="text"
					inputMode="search"
					enterKeyHint="search"
					autoComplete="off"
					spellCheck={false}
					maxLength={100}
					value={search.query}
					onChange={event => search.setQuery(event.target.value)}
					onKeyDown={handleInputKeyDown}
					placeholder="Поиск по названию"
					aria-label="Поиск заказчика по названию"
					aria-controls={listId}
					className="py-3 pr-11 pl-10"
				/>

				<div className="absolute top-1/2 right-2 -translate-y-1/2">
					{isSearching ? (
						<span className="text-on-surface-variant grid size-8 place-items-center">
							<Loader2Icon size={16} className="animate-spin" aria-hidden />
						</span>
					) : (
						search.query && (
							<button
								type="button"
								aria-label="Очистить поиск"
								onClick={() => {
									search.setQuery("")
									inputRef.current?.focus()
								}}
								className="hover:bg-secondary/40 grid size-8 place-items-center rounded-full"
							>
								<XIcon size={16} />
							</button>
						)
					)}
				</div>
			</div>

			<p role="status" className="sr-only">
				{statusText}
			</p>

			{content}

			{total !== null && total > clients.length && (
				<p className="text-on-surface-variant px-1 text-xs">
					Показаны первые {clients.length} из {total}. Уточните запрос
				</p>
			)}
		</div>
	)
}
