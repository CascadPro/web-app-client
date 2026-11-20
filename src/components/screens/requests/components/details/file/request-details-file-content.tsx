import { HardDriveIcon } from "lucide-react"
import { type FC, memo } from "react"

import { MarqueeText } from "@/components/ui/components/maruquee-text"
import { FILE_KIND_STYLE } from "@/libs/constants/screens/requests"
import { cn } from "@/libs/utils"

import type { RequestFileContentProps } from "../../../types/request-file-item"

import { RequestDetailsFileProgress } from "./request-details-file-progress"

const RequestDetailsFileContentComponent: FC<RequestFileContentProps> = ({
	Icon,
	label,
	percent,
	kind,
	filename,
	meta,
	isDownloading,
	isSavedOffline,
	isBusy
}) => {
	return (
		<>
			{isDownloading ? (
				<RequestDetailsFileProgress
					value={percent}
					label={`Скачивание: ${label}`}
					className="text-primary"
				>
					<Icon size={14} aria-hidden />
				</RequestDetailsFileProgress>
			) : (
				<span
					className={cn(
						"grid size-9 shrink-0 place-items-center rounded-lg",
						FILE_KIND_STYLE[kind]
					)}
				>
					<Icon size={18} aria-hidden />
				</span>
			)}

			<span className="grid min-w-0 flex-1 gap-0.5">
				<span className="text-on-surface-variant block text-xs">{label}</span>

				<MarqueeText
					className="w-fit text-sm font-medium"
					tag="div"
					shadow={false}
					options={{ speed: 0.4 }}
				>
					{filename || "Filename"}
				</MarqueeText>

				{(meta || isSavedOffline) && (
					<span className="text-on-surface-variant flex min-w-0 items-center gap-1.5 text-xs">
						<span className="truncate tabular-nums">{meta}</span>

						{isSavedOffline && !isBusy && (
							<span className="text-success flex shrink-0 items-center gap-1">
								<HardDriveIcon size={12} aria-hidden />
								На устройстве
							</span>
						)}
					</span>
				)}
			</span>
		</>
	)
}

export const RequestDetailsFileContent = memo(
	RequestDetailsFileContentComponent
)
RequestDetailsFileContent.displayName = "RequestDetailsFileContent"
