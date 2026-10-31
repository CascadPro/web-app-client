import { BadgeCheckIcon } from "lucide-react"
import { m } from "motion/react"
import dynamic from "next/dynamic"
import type { FC } from "react"
import { memo } from "react"

import type { DomainUserRole } from "@/api/generated"
import { Title } from "@/components/ui"
import { CopyIcon } from "@/components/ui/components/copy-icon"
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
	} = useProfileHeader(user?.avatar_file_id)

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

						<div className="mt-2 flex min-w-0 items-center justify-center gap-1 sm:justify-start">
							<span className="text-on-surface-variant min-w-0 truncate text-sm select-text">
								{`ID: ${id ? `${id.slice(0, 20)}...` : "—"}`}
							</span>

							<CopyIcon
								isCopied={isCopied}
								size={14}
								disabled={!id}
								onCopy={async () => await handleCopy(id ?? "")}
							/>

							<span className="sr-only" aria-live="polite">
								{isCopied ? "ID скопирован" : ""}
							</span>
						</div>
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
			<span className="bg-success size-3 animate-ping motion-reduce:animate-none" />
			<span className="bg-success absolute size-3" />
		</span>
	)
}

export const ProfileHeader = memo(ProfileHeaderComponent)
ProfileHeader.displayName = "ProfileHeader"
