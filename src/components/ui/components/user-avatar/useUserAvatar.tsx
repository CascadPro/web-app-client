import { useMemo, useState } from "react";

import { SERVER_URL } from "@/libs/constants";

import type { UserAvatarSize, UserAvatarUser } from "./types";

const sizes = {
	sm: {
		container: "size-8",
		text: "text-xs",
		size: 192
	},
	md: {
		container: "size-10",
		text: "text-sm",
		size: 256
	},
	lg: {
		container: "size-12",
		text: "text-base",
		size: 384
	},
	xl: {
		container: "size-16",
		text: "text-xl",
		size: 512
	},
	"2xl": {
		container: "size-24",
		text: "text-2xl",
		size: 512
	}
} as const

export const useUserAvatar = (
	user: UserAvatarUser | undefined,
	size: UserAvatarSize
) => {
	const [imageLoaded, setImageLoaded] = useState(false)
	const [imageError, setImageError] = useState(false)

	const initials = useMemo(() => {
		const first = user?.name?.trim().charAt(0) ?? ""
		const last = user?.surname?.trim().charAt(0) ?? ""

		return `${first}${last}`.toUpperCase() || "?"
	}, [user?.name, user?.surname])

	const sizeConfig = sizes[size]

	const avatarUrl = useMemo(() => {
		if (!user?.avatar_file_id || !SERVER_URL) {
			return null
		}

		const url = new URL(`${SERVER_URL}/media/avatars/${user.avatar_file_id}`)

		url.searchParams.append("q", "75")
		url.searchParams.append("w", String(sizeConfig.size))
		url.searchParams.append("h", String(sizeConfig.size))

		return url.toString()
	}, [user?.avatar_file_id, sizeConfig.size])

	const placeholder = useMemo(() => {
		if (!user?.avatar_placeholder) {
			return null
		}

		return `data:image/jpeg;base64,${user.avatar_placeholder}`
	}, [user?.avatar_placeholder])

	const hasAvatar = Boolean(avatarUrl && !imageError)
	const showPlaceholder = Boolean(placeholder && !imageLoaded)

	return {
		sizeConfig,
		avatarUrl,
		placeholder,
		initials,
		hasAvatar,
		showPlaceholder,
		imageLoaded,
		setImageLoaded,
		setImageError
	}
}
