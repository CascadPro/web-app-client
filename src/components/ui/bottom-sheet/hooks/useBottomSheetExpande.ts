import { useEffect, useState } from "react"

export const useBottomSheetExpand = (
	open: boolean,
	expanded: boolean | undefined,
	defaultExpanded: boolean,
	expandable: boolean,
	onChange: ((state: boolean) => void) | undefined
) => {
	const [internalExpanded, setInternalExpanded] = useState(defaultExpanded)

	const isExpanded = expanded ?? internalExpanded

	const setIsExpanded = (next: boolean) => {
		if (!expandable && next) return

		if (expanded === undefined) {
			setInternalExpanded(next)
		}

		onChange?.(next)
	}

	useEffect(() => {
		if (!open) {
			setIsExpanded(false)
		}
	}, [open])

	return {
		isExpanded,
		setIsExpanded
	}
}
