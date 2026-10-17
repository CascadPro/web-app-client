import { MailIcon, PhoneIcon, UsersIcon } from "lucide-react"
import { useCallback, useMemo } from "react"

import type { RequestHttpDtoGetRequestsResponseOrigin as RequestOrigin } from "@/api/generated"
import { toast } from "@/components/ui/toast"
import { useClipboardCopy } from "@/libs/hooks"
import { useRequestDetail } from "@/libs/query/hooks/use-requests"

export const useRequestCardDetails = (id: string, isCollapsed: boolean) => {
	const { request, isPending } = useRequestDetail(id, !isCollapsed)

	const height = useMemo(() => {
		if (isPending) return 11

		let result = 0

		if (request?.origin?.length) result += 7
		if (request?.client) result += 7
		if (request?.geography_description) result += 2
		if (request?.work_types?.length) result += 2
		if (request?.status_by) result += 7

		return result > 0 ? result + 3 : 0
	}, [
		isPending,
		request?.origin?.length,
		request?.client,
		request?.geography_description,
		request?.work_types?.length,
		request?.status_by
	])

	return { request, isPending, height }
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
	}, [copyText, isCopied, value])

	return { Icon, isCopied, handleClick }
}
