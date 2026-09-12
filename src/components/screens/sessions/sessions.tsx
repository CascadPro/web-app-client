"use client"

import { Globe2, LogOutIcon, ShieldCheck } from "lucide-react"
import { AnimatePresence, m } from "motion/react"

import { Button } from "@/components/ui"
import { useDeleteSessions, useSessions } from "@/libs/query/hooks"

import { SessionCard } from "./components/card/session-card"
import { SessionEmpty } from "./components/session-empty"
import { SessionLoading } from "./components/session-loading"
import { SessionSectionTitle } from "./components/session-section-title"

export function SessionsScreen() {
	const { data, isLoading, refetch } = useSessions()
	const { mutate: deleteAllSessions, isPending } = useDeleteSessions()

	const handleDeleteAllSessions = async () => {
		await deleteAllSessions()
		await refetch()
	}

	return (
		<div className="mx-auto w-full max-w-3xl space-y-8">
			<section>
				<SessionSectionTitle Icon={ShieldCheck} title="Текущий сеанс" />

				{isLoading ? (
					<SessionLoading />
				) : data?.data.current_session ? (
					<SessionCard
						key={data.data.current_session.id}
						session={data.data.current_session}
						current
					/>
				) : (
					<SessionEmpty text="Нет текущего сеанса." />
				)}
			</section>

			<section>
				<div className="mb-3 flex items-center justify-between gap-4">
					<SessionSectionTitle Icon={Globe2} title="Другие сеансы" />

					{data?.data.sessions && data.data.sessions.length > 0 && (
						<Button
							variant="ghost"
							className="active:bg-primary/20 gap-1 rounded-lg px-2 py-1.5 text-sm"
							onClick={() => void handleDeleteAllSessions()}
							disabled={isPending}
						>
							<LogOutIcon className="size-4" />
							{isPending ? "Завершение..." : "Завершить все сеансы"}
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
					) : data?.data.sessions && data.data.sessions.length === 0 ? (
						<SessionEmpty text="Нет других активных сеансов." />
					) : (
						<div className="space-y-3">
							{data?.data.sessions?.map((session, index) => (
								<SessionCard key={session.id} index={index} session={session} />
							))}
						</div>
					)}
				</AnimatePresence>
			</section>
		</div>
	)
}
