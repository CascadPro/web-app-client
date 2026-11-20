"use client"

import { PlusIcon, XIcon } from "lucide-react"
import { AnimatePresence, m } from "motion/react"
import { type FC, memo, useId } from "react"

import { AnimatedHeight, Button, Input } from "@/components/ui"
import { REQUEST_FORM_LIMITS } from "@/libs/constants/screens/requests/request-form"
import { SPRING } from "@/libs/motion"
import { cn } from "@/libs/utils"

import { type TagsFieldName, useTagsField } from "../../../hooks/useTagsField"

import { FieldError } from "./field-error"

interface Props {
	name: TagsFieldName
	label: string
	placeholder: string
}

const RequestTagsFieldComponent: FC<Props> = ({ name, label, placeholder }) => {
	const id = useId()
	const messageId = `${id}-message`

	const {
		tags,
		draft,
		hint,
		error,
		isFull,
		commit,
		remove,
		handleChange,
		handleKeyDown,
		onBlur
	} = useTagsField(name)

	const message = error ?? hint

	return (
		<div>
			<div className="mb-2 flex items-center justify-between px-1 text-sm">
				<label htmlFor={id} className="text-on-surface/70">
					{label}
				</label>

				{tags.length > 0 && (
					<span className="animate-fade-up text-on-surface-variant text-xs tabular-nums">
						{tags.length} / {REQUEST_FORM_LIMITS.TAGS_MAX_ITEMS}
					</span>
				)}
			</div>

			<AnimatedHeight>
				<ul
					className={cn(
						"relative flex flex-wrap gap-2",
						tags.length > 0 && "pb-2"
					)}
				>
					<AnimatePresence initial={false} mode="popLayout">
						{tags.map(tag => (
							<m.li
								key={tag}
								layout="position"
								initial={{ opacity: 0, scale: 0.85 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.85 }}
								transition={SPRING.snappy}
								className="bg-primary/10 text-primary flex max-w-full items-center gap-1 rounded-xl py-1 pr-1 pl-3 text-sm"
							>
								<span className="min-w-0 truncate">{tag}</span>

								<button
									type="button"
									aria-label={`Удалить «${tag}»`}
									onClick={() => remove(tag)}
									className="hover:bg-primary/20 active:bg-primary/20 shrink-0 rounded-lg p-1 transition-colors motion-reduce:transition-none"
								>
									<XIcon size={14} />
								</button>
							</m.li>
						))}
					</AnimatePresence>
				</ul>
			</AnimatedHeight>

			<div className="relative">
				<Input
					id={id}
					value={draft}
					onChange={handleChange}
					onKeyDown={handleKeyDown}
					onBlur={onBlur}
					disabled={isFull}
					placeholder={isFull ? "Достигнут лимит" : placeholder}
					enterKeyHint="done"
					autoComplete="off"
					spellCheck={false}
					maxLength={REQUEST_FORM_LIMITS.TAG_MAX_LENGTH * 2}
					aria-invalid={error ? true : undefined}
					aria-describedby={message ? messageId : undefined}
					className="ring-outline/40 focus-visible:ring-primary rounded-xl py-3 pr-12 ring"
				/>

				<AnimatePresence initial={false}>
					{draft.trim() && (
						<m.div
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.8 }}
							transition={SPRING.snappy}
							className="absolute top-1/2 right-1.5 -translate-y-1/2"
						>
							<Button
								variant="default-2"
								className="p-1.5"
								aria-label="Добавить"
								onMouseDown={event => event.preventDefault()}
								onClick={() => commit(draft)}
							>
								<PlusIcon size={18} />
							</Button>
						</m.div>
					)}
				</AnimatePresence>
			</div>

			<FieldError
				id={messageId}
				message={message}
				tone={error ? "error" : "hint"}
			/>
		</div>
	)
}

export const RequestTagsField = memo(RequestTagsFieldComponent)
RequestTagsField.displayName = "RequestTagsField"
