import type { FC } from "react"

import { Button } from "@/components/ui"
import { Modal } from "@/components/ui/modal"

interface SessionModalProps {
	isOpen: boolean
	setIsOpen: (isOpen: boolean) => void
	onDelete: () => void
	isDeleting: boolean
}

export const SessionModal: FC<SessionModalProps> = ({
	isOpen,
	setIsOpen,
	onDelete,
	isDeleting
}) => {
	const handleDelete = () => {
		onDelete()
		setIsOpen(false)
	}

	return (
		<Modal open={isOpen} onOpenChange={setIsOpen}>
			<Modal.Content className="w-[90%]">
				<Modal.Header>
					<Modal.Title>Завершить все сеансы?</Modal.Title>
				</Modal.Header>

				<Modal.Body>
					<p className="text-on-surface-variant">
						Это действие нельзя отменить.
					</p>
				</Modal.Body>

				<Modal.Footer>
					<Button
						variant="outline"
						className="p-2"
						onClick={() => setIsOpen(false)}
					>
						Отмена
					</Button>

					<Button
						variant="destructive"
						className="p-2"
						onClick={handleDelete}
						isLoading={isDeleting}
					>
						Завершить
					</Button>
				</Modal.Footer>
			</Modal.Content>
		</Modal>
	)
}
