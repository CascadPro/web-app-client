import type { FC } from "react"

import type { DomainUserRole } from "@/api/generated"
import { Skeleton } from "@/components/ui"
import {
	UserAvatar,
	type UserAvatarUser
} from "@/components/ui/components/user-avatar"
import { roleName } from "@/libs/utils"

interface Props {
	avararUrl?: string
	avatarHash?: string
	fullname: string
	role: DomainUserRole
	loading?: boolean
}

export const ProfileBadge: FC<Props> = ({
	fullname,
	role,
	avararUrl,
	avatarHash,
	loading
}) => {
	const user: UserAvatarUser = {
		avatar_file_id: avararUrl,
		avatar_placeholder: avatarHash,
		name: fullname
	}

	return (
		<div className="flex items-center gap-2">
			<UserAvatar user={user} size="lg" />

			<div className="flex w-full flex-col gap-1">
				{loading ? (
					<>
						<Skeleton className="h-4 w-2/5" />
						<Skeleton className="h-3 w-1/4" />
					</>
				) : (
					<>
						<span className="font-semibold">{fullname}</span>
						<span className="-mt-1 text-sm opacity-60">{roleName(role)}</span>
					</>
				)}
			</div>
		</div>
	)
}
