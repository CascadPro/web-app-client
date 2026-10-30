import { type FC, memo } from "react"

import type { DomainUserRole } from "@/api/generated"
import { Skeleton } from "@/components/ui"
import {
	UserAvatar,
	type UserAvatarUser
} from "@/components/ui/components/user-avatar"
import { cn, roleName } from "@/libs/utils"

interface Props {
	avatarUrl?: string
	avatarHash?: string
	fullname: string
	role: DomainUserRole
	size?: "md" | "sm"
	loading?: boolean
}

const ProfileBadgeComponent: FC<Props> = ({
	size = "md",
	fullname,
	role,
	avatarUrl: avararUrl,
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
			<UserAvatar user={user} size={size} />

			<div className="flex w-full flex-col gap-1">
				{loading ? (
					<>
						<Skeleton className="h-4 w-2/5" />
						<Skeleton className="h-3 w-1/4" />
					</>
				) : (
					<>
						<span className={cn("font-semibold", size === "sm" && "text-sm")}>
							{fullname}
						</span>

						<span
							className={cn("-mt-1 opacity-60", {
								"text-xs": size === "sm",
								"text-sm": size === "md"
							})}
						>
							{roleName(role)}
						</span>
					</>
				)}
			</div>
		</div>
	)
}

export const ProfileBadge = memo(ProfileBadgeComponent)
ProfileBadge.displayName = "ProfileBadge"
