"use client"

import { Globe2Icon, LogOutIcon, ShieldCheckIcon } from "lucide-react"

import { RefreshControl } from "@/components/providers/refresh-control"
import { Button, Section } from "@/components/ui"
import { QueryKeys } from "@/libs/query/keys"

import { SessionCard } from "./components/card/session-card"
import { SessionsList } from "./components/list/session-list"
import { SessionLoading } from "./components/list/session-loading"
import { SessionModal } from "./components/session-modal"
import { useSessionScreen } from "./hooks/useSessionScreen"

export const SessionsScreen = () => {
	const {
		sessions,
		currentSession,
		isLoading,
		error,
		handleDeleteAllSessions,
		isDeleting,
		isOpen,
		setIsOpen
	} = useSessionScreen()

	return (
		<RefreshControl queryKey={[...QueryKeys.sessions.all]}>
			<div className="mx-auto w-full max-w-3xl space-y-(--section-gap)">
				<Section
					id="current-session"
					title="Текущий сеанс"
					icon={ShieldCheckIcon}
					renderContainer={false}
				>
					{isLoading ? (
						<SessionLoading n={1} />
					) : (
						<SessionCard
							key={currentSession?.id ?? "current-session"}
							session={currentSession}
							current
						/>
					)}

					<p className="text-on-surface-variant text-sm leading-4">
						Ваше текущее устройство, с которого вы это читаете
					</p>
				</Section>

				<Section
					id="other-sessions"
					title="Другие сеансы"
					icon={Globe2Icon}
					renderContainer={false}
				>
					<SessionsList
						sessions={sessions}
						isPending={isLoading}
						error={error}
					/>

					{Boolean(sessions?.length) && (
						<Button
							variant="destructive-outline"
							className="my-4 w-full gap-2 p-3 text-base"
							onClick={() => setIsOpen(true)}
							disabled={isDeleting}
						>
							<LogOutIcon size={20} />
							{isDeleting ? "Завершение..." : "Завершить прочие сеансы"}
						</Button>
					)}
				</Section>
			</div>

			<SessionModal
				isOpen={isOpen}
				setIsOpen={() => setIsOpen(false)}
				onDelete={handleDeleteAllSessions}
				isDeleting={isDeleting}
			/>
		</RefreshControl>
	)
}
