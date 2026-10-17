import { MailIcon, PhoneIcon, UsersIcon } from "lucide-react"
import { useCallback, useMemo } from "react"

import type { RequestHttpDtoGetRequestsResponseOrigin as RequestOrigin } from "@/api/generated"
import { toast } from "@/components/ui/toast"
import { useClipboardCopy } from "@/libs/hooks"
import { useRequestDetail } from "@/libs/query/hooks/use-requests";

export const useRequestCardDetails = (id: string, isCollapsed: boolean) => {
	const { request, isPending } = useRequestDetail(id, !isCollapsed)

	const height = useMemo(() => {
		if (isPending) return 11

		let h = 0

		if (request?.origin) h += 7

		if (request?.client) h += 7

		if (request?.geography_description) h += 2

		if (request?.work_types) h += 2

		if (request?.status_by) h += 7

		if (h !== 0) h += 3

		return h
	}, [
		request?.origin?.length,
		request?.client?.id,
		request?.geography_description?.length,
		request?.work_types?.length,
		request?.status_by?.id,
		isPending
	])

	return {
		request,
		isPending,
		height
	}
}

export const useRequestCardDetailsOrigin = ({ type, value }: RequestOrigin) => {
	const [isCopied, copyText] = useClipboardCopy()

	const Icon = useMemo(() => {
		switch (type) {
			case "email":
				return MailIcon
			case "phone":
				return PhoneIcon
			default:
				return UsersIcon
		}
	}, [type])

	const handleClick = useCallback(async () => {
		if (isCopied || !value) return

		await copyText(value)

		toast.info("Текст скопирован!", {
			position: "bottom-center",
			miniature: true,
			duration: 2000
		})
	}, [value, isCopied])

	return {
		Icon,
		isCopied,
		handleClick
	}
}
