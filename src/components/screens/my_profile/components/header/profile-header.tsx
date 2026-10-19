import { BadgeCheckIcon, CheckIcon, CopyIcon } from "lucide-react"
import { m } from "motion/react"
import dynamic from "next/dynamic"
import type { FC } from "react"
import { memo } from "react"

import type { DomainUserRole } from "@/api/generated"
import { Button, Title } from "@/components/ui"
import {
	UserAvatar,
	type UserAvatarUser
} from "@/components/ui/components/user-avatar"
import { roleName } from "@/libs/utils"

import { useProfileHeader } from "../../hooks/useProfileHeader"

const DynamicProfileHeaderModal = dynamic(
	async () => (await import("./profile-header-modal")).ProfileHeaderModal,
	{ ssr: false }
)

const DynamicProfileHeaderSheet = dynamic(
	async () => (await import("./profile-header-sheet")).ProfileHeaderSheet,
	{ ssr: false }
)

interface Props {
	user: UserAvatarUser
	fullname: string
	role?: DomainUserRole
	id?: string
}

const ProfileHeaderComponent: FC<Props> = ({ user, fullname, role, id }) => {
	const {
		isModalOpen,
		isSheetOpen,
		setIsModalOpen,
		setIsSheetOpen,
		isCopied,
		handleCopy,
		handleAvatarClick,
		handleSheetCloseModal
	} = useProfileHeader(id, user?.avatar_file_id)

	return (
		<>
			<m.section
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.3 }}
				className="border-outline/20 bg-surface rounded-3xl border px-(--row-padding-x) py-(--row-padding-y) shadow-sm"
			>
				<div className="flex flex-col items-center gap-(--card-gap) sm:flex-row">
					<div className="relative shrink-0">
						<UserAvatar
							user={user}
							size="2xl"
							onClickAction={handleAvatarClick}
							className="cursor-pointer transition-opacity will-change-auto hover:opacity-60! active:opacity-60! motion-reduce:transition-none"
						/>

						<Indicator />
					</div>

					<div className="min-w-0 flex-1 text-center sm:text-left">
						<div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
							<Title
								size="md"
								className="text-on-surface truncate text-xl font-semibold"
							>
								{fullname || "Unnamed user"}
							</Title>

							<span className="bg-primary/10 text-primary inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium">
								<BadgeCheckIcon size={14} />
								{role ? roleName(role) : "Нет роли"}
							</span>
						</div>

						<Button
							variant="ghost"
							className="text-on-surface-variant active:bg-primary/10 mt-2 justify-center gap-2 rounded-md p-1 text-sm select-none sm:justify-start"
							onClick={handleCopy}
							disabled={!id}
						>
							<span className="truncate">
								{`ID: ${id ? `${id.slice(0, 20)}...` : "—"}`}
							</span>

							{isCopied ? (
								<CheckIcon size={14} className="shrink-0" />
							) : (
								<CopyIcon size={14} className="shrink-0" />
							)}
						</Button>
					</div>
				</div>
			</m.section>

			<DynamicProfileHeaderModal
				isModalOpen={isModalOpen}
				setIsModalOpen={setIsModalOpen}
				isSheetOpen={isSheetOpen}
				handleSheetOpen={() => setIsSheetOpen(true)}
				user={user}
			/>

			<DynamicProfileHeaderSheet
				isOpen={isSheetOpen}
				setIsOpen={setIsSheetOpen}
				hasAvatar={!!user?.avatar_file_id}
				handleModalClose={handleSheetCloseModal}
			/>
		</>
	)
}

export const Indicator = () => {
	return (
		<span
			title="Онлайн"
			className="bg-surface absolute right-1 bottom-1 grid size-5 place-items-center rounded-full *:rounded-full"
			aria-hidden
		>
			<span className="size-3 animate-ping bg-emerald-500 motion-reduce:animate-none" />
			<span className="absolute size-3 bg-emerald-500" />
		</span>
	)
}

export const ProfileHeader = memo(ProfileHeaderComponent)
ProfileHeader.displayName = "ProfileHeader"
