import { useMemo, useState } from "react"

import { SERVER_URL } from "@/libs/constants"

import type { UserAvatarSize, UserAvatarUser } from "./types"

const sizes = {
	sm: {
		container: "size-8",
		text: "text-xs"
	},
	md: {
		container: "size-10",
		text: "text-sm"
	},
	lg: {
		container: "size-12",
		text: "text-base"
	},
	xl: {
		container: "size-16",
		text: "text-xl"
	}
} as const

export const useUserAvatar = (
	user: UserAvatarUser | undefined,
	size: UserAvatarSize
) => {
	const [imageError, setImageError] = useState(false)

	const initials = useMemo(() => {
		const first = user?.name?.trim().charAt(0) ?? ""
		const last = user?.surname?.trim().charAt(0) ?? ""

		return `${first}${last}`.toUpperCase() || "?"
	}, [user?.name, user?.surname])

	const avatarUrl = useMemo(() => {
		if (!user?.avatar_file_id || !SERVER_URL) {
			return null
		}

		return `${SERVER_URL}/media/${user.avatar_file_id}`
	}, [user?.avatar_file_id])

	const placeholder = useMemo(() => {
		if (!user?.avatar_placeholder) {
			return null
		}

		return `data:image/jpeg;base64,${user.avatar_placeholder}`
	}, [user?.avatar_placeholder])

	const showImage = Boolean(avatarUrl && !imageError)

	const sizeConfig = sizes[size]

	return {
		sizeConfig,
		avatarUrl,
		placeholder,
		showImage,
		initials,
		setImageError
	}
}
