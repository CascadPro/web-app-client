import type { MouseEvent } from "react"

export type UserAvatarSize = "sm" | "md" | "lg" | "xl" | "2xl"

export type UserAvatarProps = {
	user?: UserAvatarUser
	size?: UserAvatarSize
	alt?: string
	className?: string
	quick?: boolean
	onClickAction?: (e: MouseEvent<HTMLDivElement>) => void
}

export type UserAvatarUser = {
	name?: string | null
	surname?: string | null
	avatar_file_id?: string | null
	avatar_placeholder?: string | null
}
