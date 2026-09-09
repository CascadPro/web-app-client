import axios from "axios"

import { ApiError, type ApiErrorCode, type ApiErrorResponse } from "./api"
import { API_ERROR_MESSAGES } from "./messages"

const isApiErrorCode = (value: unknown): value is ApiErrorCode => {
	return typeof value === "string" && value in API_ERROR_MESSAGES
}

export const parseApiError = (error: unknown): ApiError => {
	if (error instanceof ApiError) {
		return error
	}

	if (axios.isAxiosError<ApiErrorResponse>(error)) {
		const status = error.response?.status ?? 500
		const data = error.response?.data

		const code = isApiErrorCode(data?.code)
			? data.code
			: getCodeFromStatus(status)

		return new ApiError({
			code,
			status,
			message: data?.message ?? API_ERROR_MESSAGES[code],
			fields: data?.fields
		})
	}

	if (error instanceof Error) {
		return new ApiError({
			code: "internal_error",
			status: 500,
			message: error.message
		})
	}

	return new ApiError({
		code: "internal_error",
		status: 500,
		message: API_ERROR_MESSAGES.internal_error
	})
}

const getCodeFromStatus = (status: number): ApiErrorCode => {
	switch (status) {
		case 400:
			return "invalid_argument"

		case 401:
			return "unauthorized"

		case 403:
			return "forbidden"

		case 404:
			return "not_found"

		case 409:
			return "conflict"

		case 429:
			return "too_many_requests"

		default:
			return "internal_error"
	}
}
