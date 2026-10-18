"use client"

import { Globe2, LogOutIcon, ShieldCheck } from "lucide-react";

import { RefreshControl } from "@/components/providers/refresh-control";
import { Button } from "@/components/ui";
import { QueryKeys } from "@/libs/query/keys";

import { SessionCard } from "./components/card/session-card";
import { SessionsList } from "./components/list/session-list";
import { SessionLoading } from "./components/list/session-loading";
import { SessionModal } from "./components/session-modal";
import { SessionSectionTitle } from "./components/session-section-title";
import { useSessionScreen } from "./hooks/useSessionScreen";

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
			<div className="mx-auto w-full max-w-3xl space-y-(--section-gap) px-1">
				<section>
					<SessionSectionTitle Icon={ShieldCheck} title="Текущий сеанс" />

					{isLoading ? (
						<SessionLoading n={1} />
					) : (
						<SessionCard
							key={currentSession?.id ?? "current-session"}
							session={currentSession}
							current
						/>
					)}
				</section>

				<section>
					<div className="mb-3 flex items-center justify-between gap-(--card-gap)">
						<SessionSectionTitle Icon={Globe2} title="Другие сеансы" />

						{Boolean(sessions?.length) && (
							<Button
								variant="ghost"
								className="text-error active:bg-primary/20 gap-1 rounded-lg px-2 py-1.5 text-sm"
								onClick={() => setIsOpen(true)}
								disabled={isDeleting}
							>
								<LogOutIcon className="size-4" />
								{isDeleting ? "Завершение..." : "Завершить все сеансы"}
							</Button>
						)}
					</div>

					<SessionsList
						sessions={sessions}
						isPending={isLoading}
						error={error}
					/>
				</section>
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
