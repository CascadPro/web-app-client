import { MoreVerticalIcon } from "lucide-react"
import { m } from "motion/react"
import dynamic from "next/dynamic"
import type { FC } from "react"
import { memo } from "react"

import type { SessionsHttpDtoSessionDTO } from "@/api/generated"
import { Title } from "@/components/ui"
import { capitalize, cn } from "@/libs/utils"
import { formatRelativeDate } from "@/libs/utils/screens/sessions"

import { useSessionCard } from "../../hooks/useSessionCard"
import { SessionEmpty } from "../list/session-empty"

import type { SessionCardSheetProps } from "./session-card-sheet"

const DynamicSessionCardSheet = dynamic(
	async () => (await import("./session-card-sheet")).SessionCardSheet,
	{ ssr: false }
)

interface Props {
	session: SessionsHttpDtoSessionDTO | null
	current?: boolean
	index?: number
}

const SessionCardComponent: FC<Props> = ({
	session,
	current = false,
	index = 0
}) => {
	const { location, device, isOpen, setIsOpen, handleDelete, isDeleting } =
		useSessionCard(session?.id, session?.metadata)

	if (!session) {
		return <SessionEmpty />
	}

	const sessionCardSheetProps: SessionCardSheetProps = {
		ip: session.ip,
		location: session.metadata?.location,
		lastActiveAt: session.last_active_at,
		device
	}

	return (
		<>
			<m.article
				layout={!current}
				initial={{ opacity: 0, y: 12 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: 12 }}
				transition={{
					opacity: {
						duration: 0.2,
						delay: Math.min(index * 0.08, 0.24)
					},
					y: {
						duration: 0.25,
						ease: [0.22, 1, 0.36, 1],
						delay: Math.min(index * 0.08, 0.24)
					},
					layout: { duration: 0.25, ease: [0.22, 1, 0.36, 1] }
				}}
				className={cn(
					"border-outline/20 bg-surface rounded-2xl border p-4 shadow-sm",
					{
						"border-primary shadow-primary": current,
						"pointer-events-none cursor-wait opacity-60": isDeleting
					}
				)}
				onClick={() => setIsOpen(!isOpen)}
				onContextMenu={event => event.preventDefault()}
			>
				<div className="flex gap-4">
					<div className="bg-surface-variant flex size-11 shrink-0 items-center justify-center rounded-xl">
						<device.browser.icon
							size={24}
							className="text-on-surface-variant"
						/>
					</div>

					<div className="min-w-0 flex-1">
						<div className="flex items-center justify-between gap-3">
							<div className="min-w-0">
								<div className="flex flex-wrap items-center gap-2">
									<Title size="sm" className="text-on-surface truncate">
										{device.browser.name}
									</Title>

									{current && (
										<span className="shine bg-primary-container text-on-primary rounded-full px-2 py-0.5 text-xs font-medium">
											Это устройство
										</span>
									)}
								</div>

								<p className="text-on-surface-variant text-sm">
									{location?.country && capitalize(location.country)}
									{location?.city && `, ${location.city}`}
									&nbsp;&nbsp;•&nbsp;&nbsp;
									{session.online
										? "В сети"
										: formatRelativeDate(session.last_active_at || "")}
								</p>
							</div>

							<MoreVerticalIcon size={24} />
						</div>
					</div>
				</div>
			</m.article>

			<DynamicSessionCardSheet
				isOpen={isOpen}
				onOpenChange={setIsOpen}
				current={current}
				isDeleting={isDeleting}
				onDelete={handleDelete}
				session={sessionCardSheetProps}
			/>
		</>
	)
}

export const SessionCard = memo(SessionCardComponent)
SessionCard.displayName = "SessionCard"
