import { useEffect, useState } from "react"

import {
	REQUEST_ORIGIN_ICON,
	REQUEST_ORIGIN_LABEL
} from "@/libs/constants/screens/requests"
import { useClipboardCopy } from "@/libs/hooks"
import { isDev } from "@/libs/utils"

export const useRequestCopyRow = (propsValue: string, type?: string) => {
	const [isCopied, copy] = useClipboardCopy()

	const [value, setValue] = useState<string>(propsValue)
	const [isLoading, setIsLoading] = useState<boolean>(type === "url")

	const handleCopy = async () => await copy(propsValue)

	useEffect(() => {
		if (type !== "url" || !value || !value.trim().startsWith("http")) {
			return
		}

		let isMounted = true

		const fetchTitle = async () => {
			setIsLoading(true)

			try {
				const response = await fetch(
					`/api/utils/site-title?url=${encodeURIComponent(value.trim())}`
				)
				if (!response.ok) {
					throw new Error("Не удалось получить заголовок")
				}

				const data = await response.json()

				if (isMounted && data.title) {
					setValue(data.title)
				}
			} catch (error) {
				if (isDev()) {
					console.error("failed to fetch title", error)
				}
			} finally {
				if (isMounted) {
					setIsLoading(false)
				}
			}
		}

		void fetchTitle()

		return () => {
			isMounted = false
		}
	}, [])

	const Icon = REQUEST_ORIGIN_ICON[type ?? "other"] ?? REQUEST_ORIGIN_ICON.other

	const label = REQUEST_ORIGIN_LABEL[type ?? "other"]

	return {
		Icon,
		label,
		value,
		isLoading,
		isCopied,
		handleCopy
	}
}
