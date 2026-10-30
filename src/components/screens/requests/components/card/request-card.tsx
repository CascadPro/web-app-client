import { m } from "motion/react"
import dynamic from "next/dynamic"
import type { FC, Ref } from "react"
import { memo, useCallback } from "react"

import type { RequestHttpDtoGetRequestsResponseRequest as Request } from "@/api/generated"
import { MarqueeText } from "@/components/ui/components/maruquee-text/marquee-text"
import { cn } from "@/libs/utils"

import { useRequestCard } from "../../hooks/useRequestCard"

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

const DynamicRequestCardDetails = dynamic(
	() =>
		import("./details/request-card-details").then(
			mod => mod.RequestCardDetails
		),
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
		isCollapsed,
		setIsCollapsed,
		handleTouchStart,
		handleTouchEnd,
		handleTouchCancel,
		handleClickOutside
	} = useRequestCard(request)

	// Внутренний ref нужен хуку для измерений, внешний — AnimatePresence
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
					y: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
					layout: { duration: 0.25, ease: [0.22, 1, 0.36, 1] }
				}}
				className="flex flex-col justify-center gap-3 select-none"
				onContextMenu={e => e.preventDefault()}
			>
				<div
					className={cn(
						"bg-surface border-outline/20 grid overflow-hidden rounded-2xl border shadow-sm transition-colors will-change-auto motion-reduce:transition-none sm:p-1",
						isSelected && "border-transparent shadow-lg"
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
								{/* transform вместо width: не вызывает layout на каждом кадре */}
								<m.div
									initial={false}
									animate={{ x: `${progress - 100}%` }}
									transition={{ duration: 0.4, ease: "easeOut" }}
									className="bg-primary h-full w-full rounded-full"
								/>
							</div>
						</div>
					</button>

					{isSelected && (
						<DynamicRequestCardDetails
							id={request.id || ""}
							isCollapsed={isCollapsed}
						/>
					)}
				</div>

				<DynamicRequestCardActions
					id={request.id || ""}
					selected={isSelected}
					isCollapsed={isCollapsed}
					setIsCollapsed={setIsCollapsed}
				/>
			</m.article>
		</>
	)
}

export const RequestCard = memo(RequestCardComponent)
RequestCard.displayName = "RequestCard"
