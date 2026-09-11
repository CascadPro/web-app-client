import { useAuthStore } from "@/store/auth"

export const useProfilePage = () => {
	const status = useAuthStore(state => state.status)
	const user = useAuthStore(state => state.user)

	const fullName = [user?.name, user?.surname, user?.last_name]
		.filter(Boolean)
		.join(" ")

	const avatarUser = {
		avatar_file_id: user?.avatar_file_id,
		avatar_placeholder: user?.avatar_placeholder,
		name: user?.name,
		surname: user?.surname
	}

	return {
		status,
		user,
		fullName,
		avatarUser
	}
}
