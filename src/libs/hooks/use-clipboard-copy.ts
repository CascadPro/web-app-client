import { useCallback, useState } from "react"

import { copyTextToClipboard } from "../utils"

export const useClipboardCopy = (): [
	boolean,
	(text: string) => Promise<void>
] => {
	const [isCopied, setIsCopied] = useState<boolean>(false)

	const copyToClipboard = useCallback(async (text: string) => {
		try {
			await copyTextToClipboard(text)

			setIsCopied(true)

			setTimeout(() => {
				setIsCopied(false)
			}, 2000)
		} catch (error) {
			setIsCopied(false)
		}
	}, [])

	return [isCopied, copyToClipboard]
}
