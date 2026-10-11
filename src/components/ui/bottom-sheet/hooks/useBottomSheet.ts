import { useReducedMotion } from "motion/react"
import { useCallback, useEffect, useId, useRef, useState } from "react"

import { useScrollLocked } from "@/libs/hooks"

import type { BottomSheetProps } from "../types"

import { useBottomSheetAccessibility } from "./useSheetAccessibility"

export const useBottomSheet = (
	open: boolean,
	onChange: BottomSheetProps["onChange"],
	closeOnBackdropClick: boolean,
	closeOnEscape: boolean
) => {
	const [mounted, setMounted] = useState(false)
	const [hasOpened, setHasOpened] = useState(open)

	const panelRef = useRef<HTMLDivElement>(null)
	const titleId = useId()
	const reducedMotion = useReducedMotion() === true

	const close = useCallback(() => {
		onChange(false)
	}, [onChange])

	const handleBackdropClick = useCallback(() => {
		if (closeOnBackdropClick) close()
	}, [close, closeOnBackdropClick])

	useEffect(() => {
		setMounted(true)
	}, [])

	useEffect(() => {
		if (open) setHasOpened(true)
	}, [open])

	useScrollLocked(open && mounted)

	useBottomSheetAccessibility({
		open: open && mounted,
		panelRef,
		closeOnEscape,
		onClose: close
	})

	return {
		panelRef,
		titleId,
		reducedMotion,
		mounted,
		hasOpened,
		close,
		handleBackdropClick
	}
}
