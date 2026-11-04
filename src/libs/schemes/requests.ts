import { z } from "zod"

import { REQUEST_FORM_LIMITS } from "../constants/screens/request-form"
import { getTodayISO } from "../utils/screens/request-create/date"

const { TITLE_MAX, ORIGIN_MAX_ITEMS, ORIGIN_VALUE_MAX, TAGS_MAX_ITEMS } =
	REQUEST_FORM_LIMITS

const originTypeEnum = ["email", "phone", "other"] as const

const tagSchema = z
	.string()
	.trim()
	.min(1)
	.max(REQUEST_FORM_LIMITS.TAG_MAX_LENGTH, {
		error: `Не более ${REQUEST_FORM_LIMITS.TAG_MAX_LENGTH} символов`
	})

const tagsSchema = z
	.array(tagSchema)
	.max(TAGS_MAX_ITEMS, { error: `Не более ${TAGS_MAX_ITEMS} значений` })

const originSchema = z
	.object({
		type: z.enum(originTypeEnum),
		value: z
			.string()
			.trim()
			.min(1, "Укажите контакт")
			.max(ORIGIN_VALUE_MAX, `Не более ${ORIGIN_VALUE_MAX} символов`)
	})
	.superRefine((origin, ctx) => {
		if (origin.type === "email" && !z.email().safeParse(origin.value).success) {
			ctx.addIssue({
				code: "custom",
				path: ["value"],
				message: "Введите корректную электронную почту"
			})
		}

		if (origin.type === "phone") {
			const digits = origin.value.replace(/\D/g, "").length
			const allowedChars = /^\+?[\d\s\-()]+$/.test(origin.value)

			if (!allowedChars || digits < 7 || digits > 15) {
				ctx.addIssue({
					code: "custom",
					path: ["value"],
					message: "Введите корректный номер телефона"
				})
			}
		}
	})

/**
 * Схема формы заявки.
 * `unchangedDeadline` — уже сохранённый срок: при редактировании его можно оставить,
 * даже если он в прошлом (иначе нельзя было бы поправить просроченную заявку).
 */
export const makeRequestScheme = (unchangedDeadline?: string) =>
	z.object({
		title: z
			.string()
			.trim()
			.min(1, "Введите название заявки")
			.max(TITLE_MAX, `Не более ${TITLE_MAX} символов`),
		deadline: z
			.string()
			.refine(value => !value || /^\d{4}-\d{2}-\d{2}$/.test(value), {
				error: "Некорректная дата"
			})
			.refine(
				value =>
					!value || value === unchangedDeadline || value >= getTodayISO(),
				{ error: "Срок не может быть в прошлом" }
			),
		origin: z
			.array(originSchema)
			.max(ORIGIN_MAX_ITEMS, `Не более ${ORIGIN_MAX_ITEMS} контактов`),
		work_types: tagsSchema,
		geography: tagsSchema
	})

export const createRequestScheme = makeRequestScheme()

/** Черновик может быть заполнен не до конца, поэтому проверяем только форму данных */
export const requestDraftScheme = z.object({
	title: z.string().optional(),
	deadline: z.string().optional(),
	origin: z
		.array(z.object({ type: z.enum(originTypeEnum), value: z.string() }))
		.optional(),
	work_types: z.array(z.string()).optional(),
	geography: z.array(z.string()).optional()
})

export type CreateRequestFormFields = z.infer<typeof createRequestScheme>

export const createRequestDefaults: CreateRequestFormFields = {
	title: "",
	deadline: "",
	origin: [],
	work_types: [],
	geography: []
}
