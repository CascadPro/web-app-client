import { MoreVerticalIcon } from "lucide-react"
import { m } from "motion/react"
import dynamic from "next/dynamic"
import type { FC } from "react"

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

export const SessionCard: FC<Props> = ({
	session,
	current = false,
	index = 0
}) => {
	if (!session) {
		return <SessionEmpty />
	}

	const { location, device, isOpen, setIsOpen, handleDelete, isDeleting } =
		useSessionCard(session.id, session.metadata)

	const sessionCardSheetProps: SessionCardSheetProps = {
		ip: session.ip,
		location: session.metadata?.location,
		lastActiveAt: session.last_active_at,
		device
	}

	return (
		<>
			<m.article
				className={cn(
					"border-outline/20 bg-surface rounded-2xl border p-4 shadow-sm",
					{
						"border-primary shadow-primary": current,
						"pointer-events-none cursor-wait opacity-60": isDeleting
					}
				)}
				layout={!current}
				initial={{ opacity: 0, y: 12 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: 12 }}
				transition={{
					opacity: { duration: 0.2 },
					layout: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
					delay: 0.1 * index
				}}
				onClick={() => setIsOpen(state => !state)}
				onContextMenu={e => e.preventDefault()}
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
									{session?.online
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
