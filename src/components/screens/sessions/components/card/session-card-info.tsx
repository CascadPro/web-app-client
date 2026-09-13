import { CheckIcon, CopyIcon, type LucideIcon } from "lucide-react"
import type { FC } from "react"

import { Button } from "@/components/ui"
import { useClipboardCopy } from "@/libs/hooks"

interface Props {
	Icon: LucideIcon
	value: string
	toCopy?: string
}

export const SessionCardInfo: FC<Props> = ({ Icon, value, toCopy }) => {
	if (!value) return null

	const [isCopied, copy] = useClipboardCopy()

	const handleCopy = () => copy(toCopy ?? value)

	return (
		<div className="border-outline/40 mb-1 flex min-w-0 items-center justify-between border-b pb-2">
			<div className="flex items-center gap-2">
				<span className="bg-primary/20 text-primary rounded-xl p-2">
					<Icon size={24} />
				</span>

				<span className="truncate text-base">{value}</span>
			</div>

			{toCopy && (
				<Button
					variant="ghost"
					className="text-on-surface-variant active:bg-primary/10 p-1"
					onClick={handleCopy}
				>
					{isCopied ? <CheckIcon size={20} /> : <CopyIcon size={20} />}
				</Button>
			)}
		</div>
	)
}
