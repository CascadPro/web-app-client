"use client"

import { Button, Title } from "@/components/ui"
import { useLogout } from "@/libs/hooks/use-logout"
import { useAuthStore } from "@/store/auth"

export default function Profile() {
	const status = useAuthStore(state => state.status)
	const user = useAuthStore(state => state.user)

	const logout = useLogout()

	return (
		<div className="text-center">
			<Title size="lg">Profile</Title>

			<p>Auth: {status ? "Yes" : "No"}</p>

			<p>User email: {user?.email}</p>
			<p>
				User full name: {user?.name} {user?.surname}
			</p>
			<p>User role: {user?.role}</p>

			<Button className="p-2" onClick={logout}>
				Logout
			</Button>
		</div>
	)
}
