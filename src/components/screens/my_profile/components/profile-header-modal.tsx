import { XIcon } from "lucide-react"
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

import { useAvatarSwipe } from "../hooks/useAvatarSwipe"

interface Props {
	isModalOpen: boolean
	setIsModalOpen: ReactStateHook<boolean>
	user: UserAvatarUser | undefined
}

export const ProfileHeaderModal: FC<Props> = ({
	isModalOpen,
	setIsModalOpen,
	user
}) => {
	const handleModalClose = () => setIsModalOpen(false)

	const translate = useAvatarSwipe(isModalOpen, handleModalClose)

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
					<Button
						variant="ghost"
						className={cn(
							"pointer-events-none absolute top-[4%] left-3 p-1 opacity-0",
							{
								"pointer-events-auto opacity-100": translate == 0
							}
						)}
						onClick={handleModalClose}
					>
						<XIcon size={24} className="text-white" />
					</Button>

					<m.div
						initial={false}
						animate={{ translateY: `${translate}%` }}
						transition={{ duration: translate === 0 ? 0.3 : 0 }}
					>
						<UserAvatar
							user={user}
							className="h-[calc(100vw)] w-[calc(100vw)] rounded-none"
						/>
					</m.div>
				</m.div>
			</Modal.Content>
		</Modal>
	)
}
