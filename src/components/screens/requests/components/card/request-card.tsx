import { m } from "motion/react"
import dynamic from "next/dynamic"
import type { FC } from "react"

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
}

export const RequestCard: FC<Props> = ({ request }) => {
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

	return (
		<>
			<DynamicRequestCardOverlay
				selected={isSelected}
				handleClickOutside={handleClickOutside}
			/>

			<m.article
				ref={ref}
				layout
				initial={{ opacity: 0.6, y: 15 }}
				whileInView={{ opacity: 1, y: 0 }}
				whileTap={isSelected ? undefined : { scale: 0.975 }}
				viewport={{ once: true, amount: "all" }}
				animate={{
					translateY: isSelected ? selectedY : 0,
					zIndex: isSelected ? 210 : 1,
					scale: isSelected ? 1.02 : 1
				}}
				transition={{
					opacity: { duration: 0.2 },
					layout: {
						duration: 0.25,
						ease: [0.22, 1, 0.36, 1]
					}
				}}
				className="flex flex-col justify-center gap-3 select-none"
				onContextMenu={e => e.preventDefault()}
			>
				<div
					className={cn(
						"bg-surface border-outline/20 overflow-hidden rounded-2xl border shadow-sm transition-colors sm:p-1",
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
						className="flex w-full flex-col gap-3 px-4 py-5 text-left sm:px-5"
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

							<div className="bg-outline/20 h-1.5 overflow-hidden rounded-full">
								<m.div
									initial={false}
									whileInView={{ width: `${progress}%` }}
									viewport={{ once: true }}
									transition={{ duration: 0.4, ease: "easeOut" }}
									className="bg-primary h-full w-0 rounded-full"
								/>
							</div>
						</div>
					</button>

					<DynamicRequestCardDetails
						id={request.id || ""}
						isCollapsed={isCollapsed}
					/>
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
