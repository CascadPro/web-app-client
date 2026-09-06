import type { AxiosError } from "axios"

import type { CoreHttpResponseErrorResponse } from "./generated"

type HttpError = AxiosError<CoreHttpResponseErrorResponse>

export const errorCatch = (err: AxiosError) => {
	const e = err as HttpError

	const cause = e.response?.data.error
	const message = e.response?.data.message
	const timestamp = e.response?.data.timestamp

	return {
		cause,
		message,
		timestamp
	}
}
