import { RefreshCwIcon } from "lucide-react"
import type { FC } from "react"

import { Button } from "@/components/ui"

interface Props {
	disabled: boolean
	isLoading: boolean
	onClick: () => void
}

export const SettingsClearButton: FC<Props> = ({
	disabled,
	isLoading,
	onClick
}) => {
	return (
		<Button
			variant="destructive-outline"
			className="my-2 shrink-0 gap-1 px-3 py-2 text-sm"
			disabled={disabled}
			isLoading={isLoading}
			onClick={onClick}
		>
			<RefreshCwIcon
				size={16}
				className={isLoading ? "animate-spin" : ""}
				aria-hidden="true"
			/>
			<span>{isLoading ? "Очистка…" : "Очистить"}</span>
		</Button>
	)
}
