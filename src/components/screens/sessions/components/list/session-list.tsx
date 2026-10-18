import { AnimatePresence, m } from "motion/react"
import { memo } from "react"

import type { SessionsHttpDtoSessionDTO } from "@/api/generated"
import type { ErrorCatchResult } from "@/libs/utils"

import { SessionCard } from "../card/session-card"

import { SessionEmpty } from "./session-empty"
import { SessionError } from "./session-error"
import { SessionLoading } from "./session-loading"

interface Props {
	sessions: SessionsHttpDtoSessionDTO[] | null
	isPending: boolean
	error: ErrorCatchResult | null
}

const SessionsListComponent = ({ sessions, isPending, error }: Props) => {
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
		<m.div layout id="sessions-list" className="grid gap-(--card-gap)">
			<AnimatePresence mode="popLayout">
				{sessions.map((session, index) => (
					<SessionCard key={session.id} index={index} session={session} />
				))}
			</AnimatePresence>
		</m.div>
	)
}

export const SessionsList = memo(SessionsListComponent)
SessionsList.displayName = "SessionsList"
