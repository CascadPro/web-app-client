import { z } from "zod"

import { VALUES } from "../constants"
import { isValidEmail, parsePhoneNumber } from "../utils/phone"

const emailSchema = z
	.string()
	.trim()
	.lowercase()
	.refine(isValidEmail, "Введите корректную электронную почту")

const phoneSchema = z
	.string()
	.trim()
	.refine(
		val => parsePhoneNumber(val) !== null,
		"Введите корректный номер телефона в международном формате (например, +79001234567)"
	)

const passwordSchema = z
	.string()
	.min(
		VALUES.MIN_PASSWORD_LENGTH,
		`Пароль должен быть не менее ${VALUES.MIN_PASSWORD_LENGTH} символов`
	)
	.max(
		VALUES.MAX_PASSWORD_LENGTH,
		`Пароль должен быть не более ${VALUES.MAX_PASSWORD_LENGTH} символов`
	)
	.regex(/^[A-Za-z0-9!@#$%^&*_-]+$/, {
		message: "Пароль содержит недопустимые символы"
	})
	.regex(/\d/, {
		message: "Пароль должен содержать хотя бы одну цифру"
	})
	.regex(/[A-Z]/, {
		message: "Пароль должен содержать хотя бы одну заглавную букву"
	})
	.regex(/[!@#$%^&*_-]/, {
		message: "Пароль должен содержать хотя бы один спецсимвол: !@#$%^&*_-"
	})

export const loginScheme = z.object({
	email: emailSchema.optional(),
	phone: phoneSchema.optional(),
	password: passwordSchema
})

export const registerScheme = z.object({
	email: emailSchema,
	phone: phoneSchema.optional(),
	password: passwordSchema,
	token: z.uuidv4({ error: "Ключ регистрации имеет некорректный формат" })
})

export type LoginFormFields = z.infer<typeof loginScheme>
export type RegisterFormFields = z.infer<typeof registerScheme>
