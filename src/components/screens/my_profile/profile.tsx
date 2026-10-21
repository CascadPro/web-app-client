"use client"

import { PullToRefresh } from "@/components/pwa/pwa-refresh-control"

import { ProfileHeader } from "./components/header/profile-header"
import { ProfileError } from "./components/profile-error"
import { ProfileLoading } from "./components/profile-loading"
import { AccountInformation } from "./components/sections/account-information"
import { ProfileInformation } from "./components/sections/profile-information"
import { useProfilePage } from "./hooks/useProfilePage"

export const MyProfileScreen = () => {
	const { status, user, refetchUser, fullName, avatarUser, isLoading, error } =
		useProfilePage()

	if (isLoading || status === "loading") {
		return <ProfileLoading />
	}

	const handleRefresh = async () => {
		await refetchUser()
	}

	if (error && !user) {
		return <ProfileError refresh={handleRefresh} />
	}

	return (
		<PullToRefresh onRefresh={handleRefresh}>
			<div className="mx-auto w-full max-w-3xl px-1 sm:px-6">
				<div className="space-y-(--section-gap)">
					<ProfileHeader
						user={avatarUser}
						fullname={fullName}
						role={user?.role}
						id={user?.id}
					/>

					<ProfileInformation
						name={user?.name}
						surname={user?.surname}
						last_name={user?.last_name}
						email={user?.email}
					/>

					<AccountInformation
						role={user?.role}
						last_active_at={user?.last_active_at}
					/>
				</div>
			</div>
		</PullToRefresh>
	)
}
