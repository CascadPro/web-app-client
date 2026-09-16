import { PenIcon, XIcon } from "lucide-react"
import { m } from "motion/react"
import type { FC } from "react"

import { Button } from "@/components/ui"
import {
	UserAvatar,
	type UserAvatarUser
} from "@/components/ui/components/user-avatar"
import { Modal } from "@/components/ui/modal"
import { cn } from "@/libs/utils"
import type { ReactStateHook } from "@/types/base"

import { useAvatarSwipe } from "../../hooks/useAvatarSwipe"

interface Props {
	isModalOpen: boolean
	setIsModalOpen: ReactStateHook<boolean>
	isSheetOpen: boolean
	handleSheetOpen: () => void
	user: UserAvatarUser | undefined
}

export const ProfileHeaderModal: FC<Props> = ({
	isModalOpen,
	setIsModalOpen,
	isSheetOpen,
	handleSheetOpen,
	user
}) => {
	const handleModalClose = () => setIsModalOpen(false)

	const translate = useAvatarSwipe(
		isModalOpen && !isSheetOpen,
		handleModalClose
	)

	return (
		<Modal
			open={isModalOpen}
			onOpenChange={setIsModalOpen}
			overlayInteractive={false}
		>
			<Modal.Content className="rounded-none bg-transparent shadow-none">
				<m.div
					className="pointer-events-none flex h-screen flex-col justify-center"
					initial={false}
					animate={{
						backgroundColor: `color-mix(in oklab, var(--color-black) ${100 - Math.abs(translate) - 10}%, transparent)`
					}}
					transition={{ duration: translate === 0 ? 0.3 : 0 }}
				>
					<div className="absolute top-[4%] left-0 flex w-full items-center justify-between px-4">
						<Button
							variant="ghost"
							title="Закрыть"
							className={cn(
								"pointer-events-none p-1 opacity-0 active:translate-y-1",
								{ "pointer-events-auto opacity-100": translate == 0 }
							)}
							onClick={handleModalClose}
						>
							<XIcon size={24} className="text-white" />
						</Button>

						<Button
							variant="default"
							title="Редактировать"
							className={cn("pointer-events-none gap-2 p-2 opacity-0", {
								"pointer-events-auto opacity-100": translate == 0
							})}
							onClick={handleSheetOpen}
						>
							<PenIcon size={20} />
						</Button>
					</div>

					<m.div
						initial={false}
						animate={{ translateY: `${translate}%` }}
						transition={{ duration: translate === 0 ? 0.3 : 0 }}
					>
						<UserAvatar
							user={user}
							size="2xl"
							className="h-[calc(100vw)] w-[calc(100vw)] rounded-none"
						/>
					</m.div>
				</m.div>
			</Modal.Content>
		</Modal>
	)
}
