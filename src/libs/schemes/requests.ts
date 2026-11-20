import { z } from "zod"

import { DomainRequestOriginType } from "@/api/generated"

import { REQUEST_FORM_LIMITS } from "../constants/screens/requests/request-form"
import { parsePhoneNumber, normalizeEmail, isValidEmail } from "../utils/phone"
import { getTodayISO } from "../utils/screens/request-create/date"

const {
	TITLE_MAX,
	ORIGIN_MAX_ITEMS,
	ORIGIN_VALUE_MAX,
	TAGS_MAX_ITEMS,
	CLIENT_ID_MAX
} = REQUEST_FORM_LIMITS

const DEADLINE_REGEX = /^\d{4}-\d{2}-\d{2}$/

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
		type: z.enum(DomainRequestOriginType),
		email: z.string().optional(),
		phone: z.string().optional(),
		other: z.string().optional(),
	})
	.superRefine((origin, ctx) => {
		const valueFields = [origin.email, origin.phone, origin.other].filter(v => v !== undefined && v !== "").length

		if (valueFields > 1) {
			ctx.addIssue({
				code: "custom",
				path: ["email"],
				message: "Можно указать только один тип контакта: email, телефон или другое"
			})
			return
		}

		switch (origin.type) {
			case "email":
				if (origin.email !== undefined) {
					if (!origin.email || !isValidEmail(origin.email)) {
						ctx.addIssue({
							code: "custom",
							path: ["email"],
							message: "Введите корректную электронную почту"
						})
					}
				} else if (valueFields === 0) {
					ctx.addIssue({
						code: "custom",
						path: ["email"],
						message: "Укажите email"
					})
				}
				break

			case "phone":
				if (origin.phone !== undefined) {
					if (!origin.phone || parsePhoneNumber(origin.phone) === null) {
						ctx.addIssue({
							code: "custom",
							path: ["phone"],
							message: "Введите корректный номер телефона в международном формате (например, +79001234567)"
						})
					}
				} else if (valueFields === 0) {
					ctx.addIssue({
						code: "custom",
						path: ["phone"],
						message: "Укажите номер телефона"
					})
				}
				break

			case "other":
				if (origin.other !== undefined) {
					if (!origin.other || origin.other.trim() === "") {
						ctx.addIssue({
							code: "custom",
							path: ["other"],
							message: "Укажите значение"
						})
					}
				} else if (valueFields === 0) {
					ctx.addIssue({
						code: "custom",
						path: ["other"],
						message: "Укажите значение"
					})
				}
				break
		}
	})

export const makeRequestScheme = (unchangedDeadline?: string) =>
	z.object({
		title: z
			.string()
			.trim()
			.min(1, "Введите название заявки")
			.max(TITLE_MAX, `Не более ${TITLE_MAX} символов`),
		deadline: z
			.string()
			.refine(value => !value || DEADLINE_REGEX.test(value), {
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
		client_id: z.string().max(CLIENT_ID_MAX),
		work_types: tagsSchema,
		geography: tagsSchema
	})

export const createRequestScheme = makeRequestScheme()

export const requestDraftScheme = z.object({
	title: z.string().optional(),
	deadline: z.string().optional(),
	client_id: z.uuid().optional(),
	origin: z
		.array(
			z.object({
				type: z.enum(DomainRequestOriginType),
				email: z.string().optional(),
				phone: z.string().optional(),
				other: z.string().optional(),
			})
		)
		.optional(),
	work_types: z.array(z.string()).optional(),
	geography: z.array(z.string()).optional()
})

export type CreateRequestFormFields = z.infer<typeof createRequestScheme>

export const createRequestDefaults: CreateRequestFormFields = {
	title: "",
	deadline: "",
	client_id: "",
	origin: [],
	work_types: [],
	geography: []
}

export const transformOriginForApi = (origin: CreateRequestFormFields['origin']) => {
	return origin.map(o => {
		const base = { type: o.type }
		switch (o.type) {
			case "email":
				return { ...base, email: o.email ? normalizeEmail(o.email) : undefined }
			case "phone":
				return { ...base, phone: o.phone }
			case "other":
				return { ...base, other: o.other }
			default:
				return base
		}
	})
}