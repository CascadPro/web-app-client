import { CheckIcon } from "lucide-react"
import type { FC } from "react"

import type { RequestHttpDtoGetRequestsResponseOrigin as RequestOrigin } from "@/api/generated"
import { Button } from "@/components/ui"

import { useRequestCardDetailsOrigin } from "../../../hooks/useRequestCardDetails"

interface Props extends RequestOrigin {}

export const RequestDetailsOrigin: FC<Props> = props => {
	const { Icon, isCopied, handleClick } = useRequestCardDetailsOrigin(props)

	return (
		<Button
			variant="ghost"
			className="bg-surface-variant text-on-surface gap-2 rounded-xl p-3 text-sm active:scale-[0.97]"
			onClick={handleClick}
		>
			{isCopied ? <CheckIcon size={18} /> : <Icon size={18} />}

			<p className="whitespace-nowrap">{props.value}</p>
		</Button>
	)
}
