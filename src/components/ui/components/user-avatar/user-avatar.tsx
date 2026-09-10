"use client"

import Image from "next/image"
import { FC } from "react"

import { cn } from "@/libs/utils"

import { UserAvatarProps } from "./types"
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
		showImage,
		sizeConfig,
		setImageError
	} = useUserAvatar(user, size)

	return (
		<div
			className={cn(
				"relative shrink-0 overflow-hidden rounded-full",
				"bg-surface text-on-surface-variant",
				sizeConfig.container,
				className
			)}
		>
			{showImage ? (
				<Image
					src={avatarUrl || ""}
					alt={alt ?? `${user?.name ?? ""} ${user?.surname ?? ""}`.trim()}
					fill
					sizes="64px"
					className="object-cover"
					onError={() => setImageError(true)}
				/>
			) : placeholder ? (
				<img
					src={placeholder}
					alt=""
					aria-hidden="true"
					className="absolute inset-0 size-full object-cover blur-[2px]"
				/>
			) : null}

			{!showImage && !placeholder && (
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
		</div>
	)
}
