import { m } from "motion/react"
import dynamic from "next/dynamic"
import type { FC, Ref } from "react"
import { memo, useCallback, useEffect, useMemo } from "react"

import type { RequestHttpDtoGetRequestsResponseRequest as Request } from "@/api/generated"
import { MarqueeText } from "@/components/ui/components/maruquee-text/marquee-text"
import { DURATION, EASE_OUT, INSTANT, useReduceMotion } from "@/libs/motion"
import { cn } from "@/libs/utils"
import { useRequestContext } from "../../requests-context"

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
	ref?: Ref<HTMLElement>
}

const RequestCardComponent: FC<Props> = ({ request, ref: forwardedRef }) => {
	const reduceMotion = useReduceMotion()
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

	const { highlightId } = useRequestContext()
	const id = request.id || ""
	const isHighlighted = highlightId === id

	useEffect(() => {
		if (isSelected) preload()
	}, [isSelected, preload])

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

	const transition = useMemo(
		() =>
			reduceMotion
				? INSTANT
				: {
						opacity: { duration: DURATION.fast },
						y: { duration: DURATION.base, ease: EASE_OUT }
					},
		[reduceMotion]
	)

	const initial = reduceMotion ? undefined : { opacity: 0, y: 12, scale: 0.98 }
	const whileInView = reduceMotion ? undefined : { opacity: 1, scale: 1 }
	const exit = reduceMotion ? undefined : { opacity: 0, scale: 0.96 }

	const cardContainerClass = useMemo(
		() =>
			cn(
				"bg-surface border-outline/20 grid overflow-hidden rounded-2xl border shadow-sm transition-[color,background-color,border-color,box-shadow] duration-500 will-change-auto motion-reduce:transition-none sm:p-1",
				isSelected && "border-transparent shadow-lg",
				isHighlighted && "ring-primary/60 ring-2"
			),
		[isSelected, isHighlighted]
	)

	return (
		<>
			<DynamicRequestCardOverlay
				selected={isSelected}
				handleClickOutside={handleClickOutside}
			/>

			<m.article
				ref={setRefs}
				initial={initial}
				whileInView={whileInView}
				viewport={{ once: true, amount: 0.3 }}
				exit={exit}
				whileTap={isSelected ? undefined : { scale: 0.98 }}
				animate={{
					y: isSelected ? selectedY : 0,
					zIndex: isSelected ? 210 : 1
				}}
				transition={transition}
				className="flex flex-col justify-center gap-3 select-none"
				onContextMenu={e => e.preventDefault()}
			>
				<div className={cardContainerClass}>
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
						<div className="grid grid-flow-col gap-5">
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
									animate={{
										x: reduceMotion ? 0 : `${progress - 100}%`
									}}
									transition={reduceMotion ? INSTANT : { duration: 0.4, ease: "easeOut" }}
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
