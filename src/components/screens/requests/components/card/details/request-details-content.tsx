import type { FC } from "react"

import type { RequestsTransportHttpGetRequestResponse as Request } from "@/api/generated"
import { Title } from "@/components/ui"
import { UserAvatar } from "@/components/ui/components/user-avatar"

import { RequestCardBadge } from "../request-card-badge"

import { RequestDetailsClient } from "./request-details-client"
import { RequestDetailsDescription } from "./request-details-description"
import { RequestDetailsOrigin } from "./request-details-origin"

interface Props {
	origin: Request["origin"]
	geoDescription: Request["geography_description"]
	workType: Request["work_types"]
	client: Request["client"]
	status: Request["status"]
	statusBy: Request["status_by"]
}

export const RequestCardDetailsContent: FC<Props> = ({
	origin,
	geoDescription,
	workType,
	client,
	status,
	statusBy
}) => {
	return (
		<>
			{/* Origins */}
			{origin && origin.length > 0 && (
				<>
					<Title size="sm" className="mb-3">
						Источники
					</Title>

					<div className="flex items-center gap-2 overflow-x-auto pb-3">
						{origin.map(item => (
							<RequestDetailsOrigin key={item.value} {...item} />
						))}
					</div>
				</>
			)}

			{/* Geography Description */}
			{geoDescription && geoDescription.length > 0 && (
				<RequestDetailsDescription type="geo" data={geoDescription} />
			)}

			{/* Work Types */}
			{workType && workType.length > 0 && (
				<RequestDetailsDescription type="work" data={workType} />
			)}

			{/* Client */}
			{client && <RequestDetailsClient {...client} />}

			{/* Status */}
			{statusBy && (
				<div className="mt-6 flex flex-col items-end space-y-2 text-sm">
					<RequestCardBadge status={status} />

					<span>выдан пользователем</span>

					<div className="flex items-center gap-2">
						<UserAvatar size="xs" user={statusBy} quick />
						<span className="font-semibold">John Doe</span>
					</div>
				</div>
			)}
		</>
	)
}
