export type UserAvatarSize = "sm" | "md" | "lg" | "xl"

export type UserAvatarProps = {
	user?: UserAvatarUser
	size?: "sm" | "md" | "lg" | "xl"
	className?: string
	alt?: string
}

export type UserAvatarUser = {
	name?: string | null
	surname?: string | null
	avatar_file_id?: string | null
	avatar_placeholder?: string | null
}
