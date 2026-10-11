import { type FC, useMemo } from "react"

import type { DomainRequestStatus } from "@/api/generated"
import { REQUEST_STATUS_ICON } from "@/libs/constants/screens/requests"
import { cn } from "@/libs/utils"
import { getRequestStatusLabel } from "@/libs/utils/screens/requests"

const styles: Record<DomainRequestStatus, string> = {
	default: "bg-outline/30 text-on-surface-variant",
	waiting: "bg-primary/10 text-primary",
	approved: "bg-emerald-600/10 text-emerald-500",
	rejected: "bg-error/10 text-error",
	"": ""
}

interface Props {
	status?: DomainRequestStatus
}

export const RequestCardBadge: FC<Props> = ({ status }) => {
	const Icon = useMemo(() => REQUEST_STATUS_ICON[status || "default"], [status])

	return (
		<span
			className={cn(
				"flex w-fit items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
				styles[status || "default"]
			)}
		>
			<Icon size={14} />
			<span className="truncate">
				{getRequestStatusLabel(status || "default")}
			</span>
		</span>
	)
}
