import { AnimatePresence, m } from "motion/react"
import { FC } from "react"

import { SessionsHttpDtoSessionDTO } from "@/api/generated"
import { ErrorCatchResult } from "@/libs/utils"

import { SessionCard } from "../card/session-card"

import { SessionEmpty } from "./session-empty"
import { SessionError } from "./session-error"
import { SessionLoading } from "./session-loading"

interface Props {
	sessions: SessionsHttpDtoSessionDTO[] | null
	isPending: boolean
	error: ErrorCatchResult | null
}

export const SessionsList: FC<Props> = ({ sessions, isPending, error }) => {
	if (isPending) {
		return <SessionLoading />
	}

	if (error) {
		return <SessionError />
	}

	if (!sessions?.length) {
		return <SessionEmpty />
	}

	return (
		<m.div layout id="sessions-list" className="grid gap-4">
			<AnimatePresence mode="popLayout">
				{sessions.map((session, i) => (
					<SessionCard key={session.id} index={i} session={session} />
				))}
			</AnimatePresence>
		</m.div>
	)
}
