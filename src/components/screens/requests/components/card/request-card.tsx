import { m } from "motion/react"
import dynamic from "next/dynamic"
import type { FC, Ref } from "react"
import { memo, useCallback, useEffect } from "react"

import type { RequestHttpDtoGetRequestsResponseRequest as Request } from "@/api/generated"
import { MarqueeText } from "@/components/ui/components/maruquee-text/marquee-text"
import { EASE_OUT } from "@/libs/motion"
import { cn } from "@/libs/utils"
import { useRequestsUiStore } from "@/store/requests"

import { useRequestCard } from "../../hooks/useRequestCard"
import { useRequestCardSheets } from "../../hooks/useRequestCardSheets"

import { RequestCardBadge } from "./request-card-badge"
import { RequestCardDescription } from "./request-card-description"

const DynamicRequestCardOverlay = dynamic(
	() => import("./request-card-overlay").then(mod => mod.RequestCardOverlay),
	{ ssr: false }
)

const DynamicRequestCardActions = dynamic(
	() => import("./request-card-actions").then(mod => mod.RequestCardActions),
	{ ssr: false }
)

interface Props {
	request: Request
	/** Нужен AnimatePresence (mode="popLayout") для измерения уходящей карточки */
	ref?: Ref<HTMLElement>
}

const RequestCardComponent: FC<Props> = ({ request, ref: forwardedRef }) => {
	const {
		ref,
		progress,
		descriptionData,
		isSelected,
		selectedY,
		handleTouchStart,
		handleTouchEnd,
		handleTouchCancel,
		handleKeyDown,
		handleClickOutside
	} = useRequestCard(request)

	const {
		DetailsSheet,
		EditSheet,
		isDetailsOpen,
		isEditOpen,
		setDetailsOpen,
		setEditOpen,
		openDetails,
		openEdit,
		editFromDetails,
		preload
	} = useRequestCardSheets(request.id || "")

	const id = request.id || ""

	// Селектор возвращает boolean: перерисовывается только карточка, у которой он меняется
	const isHighlighted = useRequestsUiStore(
		state => state.highlightId === request.id
	)

	// Шторки подгружаем, как только карточку выделили: к нажатию «Подробнее»
	// или «Изменить» чанки уже на месте, и шторка выезжает без задержки
	useEffect(() => {
		if (isSelected) preload()
	}, [isSelected, preload])

	// Карточка «опускается» на место, а шторка выезжает поверх
	const handleDetails = useCallback(() => {
		handleClickOutside()
		void openDetails()
	}, [handleClickOutside, openDetails])

	const handleEdit = useCallback(() => {
		handleClickOutside()
		void openEdit()
	}, [handleClickOutside, openEdit])

	const setRefs = useCallback(
		(node: HTMLElement | null) => {
			ref.current = node

			if (typeof forwardedRef === "function") forwardedRef(node)
			else if (forwardedRef) forwardedRef.current = node
		},
		[ref, forwardedRef]
	)

	return (
		<>
			<DynamicRequestCardOverlay
				selected={isSelected}
				handleClickOutside={handleClickOutside}
			/>

			<m.article
				ref={setRefs}
				layout
				initial={{ opacity: 0, y: 15, scale: 0.98 }}
				whileInView={{ opacity: 1, scale: 1 }}
				viewport={{ once: true, amount: "some" }}
				exit={{ opacity: 0, scale: 0.96 }}
				whileTap={isSelected ? undefined : { scale: 0.98 }}
				animate={{
					y: isSelected ? selectedY : 0,
					zIndex: isSelected ? 210 : 1
				}}
				transition={{
					opacity: { duration: 0.2 },
					y: { duration: 0.3, ease: EASE_OUT },
					layout: { duration: 0.25, ease: EASE_OUT }
				}}
				className="flex flex-col justify-center gap-3 select-none"
				onContextMenu={e => e.preventDefault()}
			>
				<div
					className={cn(
						"bg-surface border-outline/20 grid overflow-hidden rounded-2xl border shadow-sm transition-[color,background-color,border-color,box-shadow] duration-500 will-change-auto motion-reduce:transition-none sm:p-1",
						isSelected && "border-transparent shadow-lg",
						isHighlighted && "ring-primary/60 ring-2"
					)}
				>
					<button
						type="button"
						aria-expanded={isSelected}
						aria-label={isSelected ? "Закрыть карточку" : "Открыть карточку"}
						onTouchStart={handleTouchStart}
						onTouchEnd={handleTouchEnd}
						onTouchCancel={handleTouchCancel}
						onTouchMove={handleTouchCancel}
						onKeyDown={handleKeyDown}
						className="flex w-full flex-col gap-3 px-(--row-padding-x) py-(--row-padding-y) text-left sm:px-5"
					>
						<div className="flex justify-between gap-5">
							<MarqueeText
								className="text-on-surface text-lg"
								tag="h3"
								options={{ speed: 0.45 }}
							>
								{request.title || ""}
							</MarqueeText>

							<RequestCardBadge status={request.status} />
						</div>

						{descriptionData.map(item => (
							<RequestCardDescription key={item.itemKey} {...item} />
						))}

						<div className="mt-1 space-y-2">
							<div className="text-on-surface-variant flex items-center justify-between text-xs">
								<span>Заполнение</span>
								<span>{progress}%</span>
							</div>

							<div
								role="progressbar"
								aria-label="Заполнение"
								aria-valuemin={0}
								aria-valuemax={100}
								aria-valuenow={progress}
								className="bg-outline/20 h-1.5 overflow-hidden rounded-full"
							>
								<m.div
									initial={false}
									animate={{ x: `${progress - 100}%` }}
									transition={{ duration: 0.4, ease: "easeOut" }}
									className="bg-primary h-full w-full rounded-full"
								/>
							</div>
						</div>
					</button>
				</div>

				<DynamicRequestCardActions
					id={id}
					status={request.status}
					selected={isSelected}
					onDetails={handleDetails}
					onEdit={handleEdit}
					onDone={handleClickOutside}
				/>
			</m.article>

			{DetailsSheet && (
				<DetailsSheet
					id={id}
					open={isDetailsOpen}
					onOpenChange={setDetailsOpen}
					onEdit={editFromDetails}
				/>
			)}

			{EditSheet && (
				<EditSheet id={id} open={isEditOpen} onOpenChange={setEditOpen} />
			)}
		</>
	)
}

export const RequestCard = memo(RequestCardComponent)
RequestCard.displayName = "RequestCard"
