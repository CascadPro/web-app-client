"use client"

import { type FC } from "react"

import type { RequestsTransportHttpGetRequestResponse } from "@/api/generated"
import { UserAvatar } from "@/components/ui/components/user-avatar"
import {
	STATUS_BY_LABEL,
	USER_ROLE_LABEL
} from "@/libs/constants/screens/requests/request-details"
import { getFullName } from "@/libs/utils/screens/request-details"

interface Props {
	user: RequestsTransportHttpGetRequestResponse["status_by"]
	status: RequestsTransportHttpGetRequestResponse["status"]
}

export const RequestDetailsStatus: FC<Props> = ({ user, status }) => {
	const name = getFullName(user)

	if (!user || !name) return null

	return (
		<section aria-label="Кто изменил статус">
			<div className="bg-surface-variant/40 border-outline/20 flex items-center gap-3 rounded-2xl border p-(--row-padding-y)">
				<UserAvatar user={user} size="md" />

				<div className="min-w-0">
					<p className="text-on-surface-variant text-xs">
						{STATUS_BY_LABEL[status || "default"] ?? STATUS_BY_LABEL.default}
					</p>

					<p className="truncate text-sm font-medium">{name}</p>

					{user.role && USER_ROLE_LABEL[user.role] && (
						<p className="text-on-surface-variant truncate text-xs">
							{USER_ROLE_LABEL[user.role]}
						</p>
					)}
				</div>
			</div>
		</section>
	)
}
