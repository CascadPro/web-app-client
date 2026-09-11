export type UserAvatarSize = "sm" | "md" | "lg" | "xl" | "2xl"

export type UserAvatarProps = {
	user?: UserAvatarUser
	size?: UserAvatarSize
	className?: string
	alt?: string
}

export type UserAvatarUser = {
	name?: string | null
	surname?: string | null
	avatar_file_id?: string | null
	avatar_placeholder?: string | null
}
