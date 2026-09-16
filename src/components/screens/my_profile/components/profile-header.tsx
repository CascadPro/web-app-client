import { BadgeCheckIcon, CheckIcon, CopyIcon } from "lucide-react"
import { m } from "motion/react"
import dynamic from "next/dynamic"
import { type FC, useState } from "react"

import type { DomainUserRole } from "@/api/generated"
import { Button, Title } from "@/components/ui"
import {
	UserAvatar,
	type UserAvatarUser
} from "@/components/ui/components/user-avatar"
import { useClipboardCopy } from "@/libs/hooks"
import { roleName } from "@/libs/utils"

const DynamicProfileHeaderModal = dynamic(
	async () => (await import("./profile-header-modal")).ProfileHeaderModal,
	{ ssr: false }
)

interface Props {
	user: UserAvatarUser
	fullname: string
	role?: DomainUserRole
	id?: string
}

export const ProfileHeader: FC<Props> = ({ user, fullname, role, id }) => {
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
	const [isCopied, copyToClipboard] = useClipboardCopy()

	const handleCopy = () => copyToClipboard(id ?? "")
	const handleModalOpen = () => setIsModalOpen(true)

	return (
		<>
			<m.section
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.3 }}
				className="border-outline/20 bg-surface rounded-3xl border p-5 shadow-sm sm:p-6"
			>
				<div className="flex flex-col items-center gap-5 sm:flex-row">
					<div className="relative shrink-0">
						<UserAvatar
							user={user}
							size="2xl"
							onClickAction={handleModalOpen}
							className="cursor-pointer transition-opacity hover:opacity-60! active:opacity-60!"
						/>

						<div
							className="border-surface absolute right-1 bottom-1 size-4 rounded-full border-2 bg-green-500"
							title="Online"
						/>
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
						>
							<span className="truncate">ID: {id?.slice(0, 20) + "..."}</span>

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
				user={user}
			/>
		</>
	)
}
