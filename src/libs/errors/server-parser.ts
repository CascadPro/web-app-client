import axios from "axios"

import { ApiErrorResponse } from "./api"

export const parseServerError = (error: unknown): ApiErrorResponse => {
	if (axios.isAxiosError<ApiErrorResponse>(error)) {
		return {
			code: error.response?.data?.code,
			message: error.response?.data?.message,
			fields: error.response?.data?.fields
		}
	}

	return {
		code: "internal_error",
		message: "Произошла внутренняя ошибка сервера"
	}
}
