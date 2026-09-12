import {
	Clock3Icon,
	Globe2Icon,
	HandIcon,
	MapPinIcon,
	ShieldCheckIcon
} from "lucide-react"
import { type FC, type MouseEvent, useEffect } from "react"
import BottomSheet from "react-swipeable-bottom-sheet"

import type { SessionsHttpDtoSessionDtoMetadataLocation } from "@/api/generated"
import { Button, Title } from "@/components/ui"
import { formatRelativeDate } from "@/libs/utils"
import { SessionParsedDevice } from "@/types/base"

import { SessionCardInfo } from "./session-card-info"

interface Props {
	isOpen: boolean
	onOpenChange: (state: boolean) => void
	current: boolean
	isDeleting: boolean
	onDelete: (e: MouseEvent<HTMLButtonElement>) => Promise<void>
	session: SessionCardSheetProps
}

export interface SessionCardSheetProps {
	device: SessionParsedDevice
	ip?: string
	location?: SessionsHttpDtoSessionDtoMetadataLocation
	lastActiveAt?: string
}

export const SessionCardSheet: FC<Props> = ({
	isOpen,
	onOpenChange,
	current,
	isDeleting,
	onDelete,
	session: { ip, location, device, lastActiveAt }
}) => {
	const locationValue = [location?.city, location?.country]
		.filter(Boolean)
		.join(", ")

	useEffect(() => {
		if (isOpen) {
			document.body.classList.add("scroll-locked")
		} else {
			document.body.classList.remove("scroll-locked")
		}
	}, [isOpen])

	return (
		<BottomSheet
			open={isOpen}
			onChange={onOpenChange}
			style={{ zIndex: 200, bottom: -12 }}
			bodyStyle={{ backgroundColor: "var(--background)" }}
			defaultOpen={false}
		>
			<div className="text-on-background mt-4 grid gap-2 p-5 text-sm">
				<div className="bg-on-surface-variant/50 absolute top-3 left-1/2 h-2 w-24 -translate-1/2 rounded-2xl" />

				<Title size="md" className="mb-2">
					Детальная информация о сеансе
				</Title>

				<SessionCardInfo Icon={MapPinIcon} value={locationValue} />

				<SessionCardInfo Icon={Globe2Icon} value={ip || ""} />

				<SessionCardInfo Icon={device.os.icon} value={device.label} />

				<SessionCardInfo
					Icon={Clock3Icon}
					value={`Последняя активность ${formatRelativeDate(lastActiveAt || "")}`}
				/>

				{current ? (
					<div className="bg-primary-container shine text-on-primary my-2 flex items-center justify-center gap-1 rounded-xl py-3">
						<ShieldCheckIcon size={20} />
						<span className="mb-0.5">Это текущий сеанс</span>
					</div>
				) : (
					<Button
						variant="destructive"
						className="my-2 gap-2 rounded-xl py-3"
						onClick={onDelete}
						isLoading={isDeleting}
					>
						<HandIcon size={20} />
						<span className="mb-0.5">Завершить сеанс</span>
					</Button>
				)}
			</div>
		</BottomSheet>
	)
}
