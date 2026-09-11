"use client"

import Image from "next/image"
import type { FC } from "react"

import { cn } from "@/libs/utils"

import type { UserAvatarProps } from "./types"
import { useUserAvatar } from "./useUserAvatar"

export const UserAvatar: FC<UserAvatarProps> = ({
	user,
	size = "md",
	className,
	alt
}) => {
	const {
		avatarUrl,
		initials,
		placeholder,
		sizeConfig,
		hasAvatar,
		showPlaceholder,
		imageLoaded,
		setImageError,
		setImageLoaded
	} = useUserAvatar(user, size)

	return (
		<div
			className={cn(
				"relative shrink-0 overflow-hidden rounded-full ring-4",
				"bg-primary/10 text-primary ring-primary/5 font-semibold",
				sizeConfig.container,
				className
			)}
		>
			{/* Placeholder */}
			{showPlaceholder && (
				<img
					src={placeholder || ""}
					alt=""
					aria-hidden="true"
					className="absolute inset-0 size-full object-cover"
				/>
			)}

			{/* Initials */}
			{!hasAvatar && !placeholder && (
				<div
					className={cn(
						"flex size-full items-center justify-center",
						"font-medium uppercase select-none",
						sizeConfig.text
					)}
				>
					{initials}
				</div>
			)}

			{/* Avatar */}
			{hasAvatar && (
				<Image
					src={avatarUrl || ""}
					alt={alt ?? `${user?.name ?? ""} ${user?.surname ?? ""}`.trim()}
					fill
					sizes="64px"
					className={cn(
						"object-cover",
						"transition-opacity duration-200",
						imageLoaded ? "opacity-100" : "opacity-0"
					)}
					onLoad={() => setImageLoaded(true)}
					onError={() => {
						setImageError(true)
						setImageLoaded(false)
					}}
				/>
			)}
		</div>
	)
}
