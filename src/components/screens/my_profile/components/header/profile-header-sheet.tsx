import { Trash2Icon, UploadIcon } from "lucide-react"
import type { FC } from "react"

import { BottomSheet } from "@/components/ui"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import type { ReactStateHook } from "@/types/base"

import { useProfileHeaderSheet } from "../../hooks/useProfileHeaderSheet"

const ALLOWED_AVATAR_FILE_TYPES = [
	"image/jpeg",
	"image/jpg",
	"image/png",
	"image/webp",
	"image/gif"
]

interface Props {
	isOpen: boolean
	setIsOpen: ReactStateHook<boolean>
	hasAvatar: boolean
	handleModalClose: () => void
}

export const ProfileHeaderSheet: FC<Props> = ({
	isOpen,
	setIsOpen,
	hasAvatar,
	handleModalClose
}) => {
	const handleClose = () => {
		setIsOpen(false)
		handleModalClose()
	}

	const handleOnChange = (state: boolean) => {
		if (isDeleting || isUploading) return
		setIsOpen(state)
	}

	const {
		inputRef,
		handleUpdateClick,
		handleUploadAvatar,
		handleDeleteAvatar,
		isDeleting,
		isUploading
	} = useProfileHeaderSheet(handleClose)

	return (
		<BottomSheet
			open={isOpen}
			onChange={handleOnChange}
			zIndex={8888 + 1}
			className="flex flex-col gap-2 px-3 py-6 [&>button]:gap-1 [&>button]:p-2 [&>button]:text-base"
			indicator={false}
			panelCN="bg-background!"
			dragToClose={!isDeleting && !isUploading}
		>
			<Button
				variant="default-2"
				onClick={handleUpdateClick}
				isLoading={isUploading}
				disabled={isDeleting || isUploading}
			>
				<UploadIcon size={20} />
				Загрузить изображение
			</Button>

			<input
				type="file"
				accept={ALLOWED_AVATAR_FILE_TYPES.join(",")}
				className="sr-only"
				onChange={handleUploadAvatar}
				ref={inputRef}
			/>

			<p className="text-on-surface-variant px-2 text-xs">
				Загрузите изображение в формате JPG, PNG, WEBP или GIF, объёмом до 10MB
				и разрешением не меньше 128x128.
			</p>

			{hasAvatar && (
				<>
					<Separator type="horizontal" className="bg-secondary my-4" />

					<Button
						variant="destructive-outline"
						onClick={handleDeleteAvatar}
						isLoading={isDeleting}
						disabled={isDeleting || isUploading}
					>
						<Trash2Icon size={20} />
						Удалить аватар
					</Button>
				</>
			)}
		</BottomSheet>
	)
}
