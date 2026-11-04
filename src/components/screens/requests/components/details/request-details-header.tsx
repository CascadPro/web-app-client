"use client"

import { CalendarDaysIcon } from "lucide-react"
import { m } from "motion/react"
import { type FC, useMemo } from "react"

import type { RequestsTransportHttpGetRequestResponse } from "@/api/generated"
import { DURATION, EASE_OUT } from "@/libs/motion"
import { cn } from "@/libs/utils"
import { getTodayISO } from "@/libs/utils/screens/request-create"
import { getDeadlineInfo } from "@/libs/utils/screens/request-details"
import {
	formatRequestDate,
	getRequestProgress
} from "@/libs/utils/screens/requests"

import { RequestCardBadge } from "../card/request-card-badge"

interface Props {
	request: RequestsTransportHttpGetRequestResponse
}

const TONE_STYLE = {
	overdue: "bg-error/10 text-error",
	soon: "bg-warning/10 text-warning",
	normal: "bg-primary/10 text-primary"
} as const

export const RequestDetailsHeader: FC<Props> = ({ request }) => {
	const today = useMemo(getTodayISO, [])
	const deadline = getDeadlineInfo(request.deadline, today)

	const progress = getRequestProgress(request.fields_remaining?.length ?? 0)

	return (
		<header className="flex flex-col gap-3">
			<div className="flex items-start justify-between gap-3">
				<h2 className="min-w-0 text-xl leading-snug font-semibold break-words">
					{request.title}
				</h2>

				<div className="shrink-0 pt-0.5">
					<RequestCardBadge status={request.status} />
				</div>
			</div>

			<p className="text-on-surface-variant text-sm">
				Создана {formatRequestDate(request.created_at)}
				{request.updated_at && request.updated_at !== request.created_at && (
					<> · обновлена {formatRequestDate(request.updated_at)}</>
				)}
			</p>

			<div
				className={cn(
					"flex items-center gap-2 rounded-xl px-3 py-2 text-sm",
					deadline
						? TONE_STYLE[deadline.tone]
						: "bg-outline/20 text-on-surface-variant"
				)}
			>
				<CalendarDaysIcon size={18} className="shrink-0" aria-hidden />

				<span className="min-w-0">
					{request.deadline ? (
						<>
							Срок сдачи {formatRequestDate(request.deadline)}
							{deadline && (
								<span className="font-medium"> · {deadline.label}</span>
							)}
						</>
					) : (
						"Срок сдачи не указан"
					)}
				</span>
			</div>

			<div>
				<div className="text-on-surface-variant mb-1.5 flex justify-between text-xs">
					<span>Заполнено</span>
					<span className="tabular-nums">{progress}%</span>
				</div>

				<div
					role="progressbar"
					aria-label="Заполненность заявки"
					aria-valuemin={0}
					aria-valuemax={100}
					aria-valuenow={progress}
					className="bg-outline/30 h-1.5 overflow-hidden rounded-full"
				>
					<m.div
						initial={{ scaleX: 0 }}
						animate={{ scaleX: progress / 100 }}
						transition={{ duration: DURATION.slow, ease: EASE_OUT }}
						className="bg-primary h-full origin-left rounded-full"
					/>
				</div>
			</div>
		</header>
	)
}
