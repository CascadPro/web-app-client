import { parseApiError } from "@/libs/errors"

export interface ErrorCatchResult {
	message: string
	code: string
	fields: Record<string, string>
	status: number
}

export const errorCatch = (error: unknown): ErrorCatchResult => {
	const apiError = parseApiError(error)

	return {
		message: apiError.message,
		code: apiError.code,
		fields: apiError.fields,
		status: apiError.status
	}
}
