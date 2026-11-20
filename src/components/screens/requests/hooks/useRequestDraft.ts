"use client"

import {
	useCallback,
	useEffect,
	useLayoutEffect,
	useRef,
	useState
} from "react"
import type { UseFormReturn } from "react-hook-form"

import {
	REQUEST_DRAFT_NOTICE_DURATION,
	REQUEST_DRAFT_SAVE_DELAY
} from "@/libs/constants/screens/requests/request-form"
import type { CreateRequestFormFields } from "@/libs/schemes"
import {
	loadRequestDraft,
	saveRequestDraft
} from "@/libs/utils/screens/request-create"

interface UseRequestDraftReturn {
	isRestored: boolean
	dismissRestored: () => void
}

export const useRequestDraft = (
	form: UseFormReturn<CreateRequestFormFields>,
	open: boolean
): UseRequestDraftReturn => {
	const [hasPendingNotice, setHasPendingNotice] = useState(false)
	const [isRestored, setIsRestored] = useState(false)
	const loadedRef = useRef(false)

	useLayoutEffect(() => {
		if (loadedRef.current) return

		loadedRef.current = true

		void loadRequestDraft().then(draft => {
			if (!draft) return

			form.reset(draft, { keepDefaultValues: true })
			setHasPendingNotice(true)
		})
	}, [form])

	useEffect(() => {
		if (!open || !hasPendingNotice) return

		setHasPendingNotice(false)
		setIsRestored(true)
	}, [open, hasPendingNotice])

	useEffect(() => {
		if (!isRestored) return

		const timer = setTimeout(
			() => setIsRestored(false),
			REQUEST_DRAFT_NOTICE_DURATION
		)

		return () => clearTimeout(timer)
	}, [isRestored])

	useEffect(() => {
		let timer: ReturnType<typeof setTimeout> | undefined

		const subscription = form.watch(() => {
			clearTimeout(timer)

			timer = setTimeout(() => {
				void saveRequestDraft(form.getValues())
			}, REQUEST_DRAFT_SAVE_DELAY)
		})

		return () => {
			clearTimeout(timer)
			subscription.unsubscribe()
		}
	}, [form])

	const dismissRestored = useCallback(() => setIsRestored(false), [])

	return { isRestored, dismissRestored }
}
