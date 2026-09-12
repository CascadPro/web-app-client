import { MoreVerticalIcon } from "lucide-react"
import { m } from "motion/react"
import dynamic from "next/dynamic"
import type { FC } from "react"

import type { SessionsHttpDtoSessionDto } from "@/api/generated"
import { Title } from "@/components/ui"
import { capitalize, cn, formatRelativeDate } from "@/libs/utils"

import { useSessionCard } from "../../hooks/useSessionCard"

import type { SessionCardSheetProps } from "./session-card-sheet"

const DynamicSessionCardSheet = dynamic(
	async () => (await import("./session-card-sheet")).SessionCardSheet,
	{ ssr: false }
)

interface Props {
	session: SessionsHttpDtoSessionDto
	current?: boolean
	index?: number
}

export const SessionCard: FC<Props> = ({
	session,
	current = false,
	index = 0
}) => {
	const { location, device, isOpen, setIsOpen, handleDelete, isDeleting } =
		useSessionCard(session?.id, session?.metadata)

	const sessionCardSheetProps: SessionCardSheetProps = {
		ip: session?.ip,
		location: session?.metadata?.location,
		lastActiveAt: session?.last_active_at,
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
				initial={{ opacity: 0, y: 8 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: 8 }}
				transition={{ delay: index * 0.1 }}
				onClick={() => setIsOpen(state => !state)}
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
									{formatRelativeDate(session.last_active_at || "")}
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
				isDeleting={isDeleting}
				onDelete={handleDelete}
				session={sessionCardSheetProps}
			/>
		</>
	)
}
