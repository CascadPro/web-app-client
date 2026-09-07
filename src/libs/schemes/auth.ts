import { z } from "zod"

import { VALUES } from "../constants"

export const loginScheme = z.object({
	email: z.email("Введите корректную электронную почту").lowercase(),
	password: z
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
})

export const registerScheme = loginScheme.extend({
	token: z.uuidv4({ error: "Ключ регистрации имеет некорректный формат" })
})

export type LoginFormFields = z.infer<typeof loginScheme>
export type RegisterFormFields = z.infer<typeof registerScheme>
