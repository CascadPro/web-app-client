"use client"

import { Globe2, LogOutIcon, ShieldCheck } from "lucide-react"
import { AnimatePresence, m } from "motion/react"

import { RefreshControl } from "@/components/providers/refresh-control"
import { Button } from "@/components/ui"

import { SessionCard } from "./components/card/session-card"
import { SessionEmpty } from "./components/session-empty"
import { SessionLoading } from "./components/session-loading"
import { SessionModal } from "./components/session-modal"
import { SessionSectionTitle } from "./components/session-section-title"
import { useSessionPage } from "./hooks/useSessionPage"

export function SessionsScreen() {
	const {
		data,
		isLoading,
		handleDeleteAllSessions,
		isDeleting,
		isOpen,
		setIsOpen
	} = useSessionPage()

	return (
		<RefreshControl>
			<div className="mx-auto mb-20 w-full max-w-3xl space-y-8">
				<section>
					<SessionSectionTitle Icon={ShieldCheck} title="Текущий сеанс" />

					{isLoading ? (
						<SessionLoading />
					) : data?.current_session ? (
						<SessionCard
							key={data.current_session.id}
							session={data.current_session}
							current
						/>
					) : (
						<SessionEmpty text="Нет текущего сеанса." />
					)}
				</section>

				<section>
					<div className="mb-3 flex items-center justify-between gap-4">
						<SessionSectionTitle Icon={Globe2} title="Другие сеансы" />

						{data?.sessions && data.sessions.length > 0 && (
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

					<AnimatePresence mode="wait">
						{isLoading ? (
							<m.div
								initial={false}
								exit={{ opacity: 0, y: 20, display: "none" }}
								className="space-y-3"
							>
								<SessionLoading />
								<SessionLoading />
							</m.div>
						) : data?.sessions && data.sessions.length === 0 ? (
							<SessionEmpty text="Нет других активных сеансов." />
						) : (
							<div className="space-y-4">
								{data?.sessions?.map((session, index) => (
									<SessionCard
										key={session.id}
										index={index}
										session={session}
									/>
								))}
							</div>
						)}
					</AnimatePresence>
				</section>
			</div>
		</RefreshControl>
	)
}
