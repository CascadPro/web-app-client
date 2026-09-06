import { z } from "zod"

export const loginScheme = z.object({
	email: z.email("Введите корректную электронную почту").lowercase(),
	password: z.string().min(8, "Пароль должен быть не менее 8 символов")
})

export const registerScheme = loginScheme.extend({
	token: z.uuidv4({ error: "Токен должен быть валидным UUID v4" })
})

export type LoginFormFields = z.infer<typeof loginScheme>
export type RegisterFormFields = z.infer<typeof registerScheme>
