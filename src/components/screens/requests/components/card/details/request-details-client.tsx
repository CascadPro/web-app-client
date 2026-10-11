import { TagIcon, UsersIcon } from "lucide-react"
import type { FC } from "react"

import type { RequestHttpDtoGetRequestResponseClient } from "@/api/generated"
import { Title } from "@/components/ui"

import { RequestCardDescription } from "../request-card-description"

export interface Props extends Omit<
	RequestHttpDtoGetRequestResponseClient,
	"id"
> {}

export const RequestDetailsClient: FC<Props> = ({ company, contacts }) => {
	return (
		<>
			<Title size="sm" className="mt-4 mb-2">
				Заказчик
			</Title>

			<div className="space-y-2">
				<RequestCardDescription icon={TagIcon} text={company || ""} />

				{contacts?.map(item => (
					<RequestCardDescription key={item} icon={UsersIcon} text={item} />
				))}
			</div>
		</>
	)
}
