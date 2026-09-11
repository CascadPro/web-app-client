"use client"

import { AccountInformation } from "./components/account-information"
import { ProfileHeader } from "./components/profile-header"
import { ProfileInformation } from "./components/profile-information"
import { ProfileLoading } from "./components/profile-loading"
import { useProfilePage } from "./hooks/useProfilePage"

export const MyProfilePage = () => {
	const { status, user, fullName, avatarUser } = useProfilePage()

	if (status === "loading") {
		return <ProfileLoading />
	}

	return (
		<main className="mx-auto mb-20 w-full max-w-3xl px-4 sm:px-6 sm:py-10">
			<div className="space-y-6">
				{/* Profile header */}
				<ProfileHeader
					user={avatarUser}
					fullname={fullName}
					role={user?.role}
					id={user?.id}
				/>

				{/* Personal information */}
				<ProfileInformation
					name={user?.name}
					surname={user?.surname}
					last_name={user?.last_name}
					email={user?.email}
				/>

				{/* Account information */}
				<AccountInformation
					role={user?.role}
					last_active_at={user?.last_active_at}
				/>
			</div>
		</main>
	)
}
