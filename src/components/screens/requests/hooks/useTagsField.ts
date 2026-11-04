"use client"

import {
	type ChangeEvent,
	type KeyboardEvent,
	useCallback,
	useState
} from "react"
import { useController, useFormContext } from "react-hook-form"

import {
	REQUEST_FORM_LIMITS,
	REQUEST_TAG_HINTS
} from "@/libs/constants/screens/request-form"
import type { CreateRequestFormFields } from "@/libs/schemes"
import { mergeTags, splitTags } from "@/libs/utils/screens/request-create"

export type TagsFieldName = "work_types" | "geography"

export const useTagsField = (name: TagsFieldName) => {
	const { control, formState } = useFormContext<CreateRequestFormFields>()
	const { field } = useController({ control, name })

	const tags = field.value
	const [draft, setDraft] = useState("")
	const [hint, setHint] = useState<string | null>(null)

	const formError = (formState.errors[name] as { message?: string } | undefined)
		?.message

	const commit = useCallback(
		(raw: string) => {
			const parts = splitTags(raw)

			if (parts.every(part => !part.trim())) {
				setDraft("")
				return
			}

			const { tags: next, skipped } = mergeTags(tags, parts)

			if (next.length !== tags.length) {
				field.onChange(next)
			}

			setHint(skipped ? REQUEST_TAG_HINTS[skipped] : null)

			// При ошибке оставляем текст, чтобы пользователь мог его поправить
			setDraft(skipped === "length" || skipped === "limit" ? raw : "")
		},
		[field, tags]
	)

	const remove = useCallback(
		(tag: string) => {
			field.onChange(tags.filter(item => item !== tag))
			setHint(null)
		},
		[field, tags]
	)

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		const { value } = event.target

		if (/[,;]/.test(value)) {
			commit(value)
			return
		}

		if (hint) setHint(null)

		setDraft(value)
	}

	const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
		if (event.nativeEvent.isComposing) return

		if (event.key === "Enter") {
			// Enter внутри поля тегов не должен отправлять всю форму
			event.preventDefault()
			commit(draft)
			return
		}

		if (event.key === "Backspace" && !draft && tags.length > 0) {
			remove(tags[tags.length - 1])
		}
	}

	return {
		tags,
		draft,
		hint,
		error: formError,
		isFull: tags.length >= REQUEST_FORM_LIMITS.TAGS_MAX_ITEMS,
		commit,
		remove,
		handleChange,
		handleKeyDown,
		onBlur: () => {
			commit(draft)
			field.onBlur()
		}
	}
}
