import {
	CheckIcon,
	type LucideIcon,
	MailIcon,
	PhoneIcon,
	UsersIcon
} from "lucide-react"
import type { FC } from "react"

import type { RequestHttpDtoGetRequestsResponseOrigin as RequestOrigin } from "@/api/generated"
import { Button } from "@/components/ui"
import { useClipboardCopy } from "@/libs/hooks"

interface Props extends RequestOrigin {}

export const RequestDetailsOrigin: FC<Props> = ({ type, value }) => {
	let Icon: LucideIcon = UsersIcon

	if (type === "email") {
		Icon = MailIcon
	} else if (type === "phone") {
		Icon = PhoneIcon
	}

	const [isCopied, copyText] = useClipboardCopy()

	const handleClick = () => {
		if (isCopied || !value) return

		copyText(value)
	}

	return (
		<Button
			variant="ghost"
			className="bg-surface-variant text-on-surface flex items-center gap-2 rounded-xl p-3 text-sm active:scale-[0.97]"
			onClick={handleClick}
		>
			{isCopied ? <CheckIcon size={18} /> : <Icon size={18} />}

			<p className="whitespace-nowrap">{value}</p>
		</Button>
	)
}
