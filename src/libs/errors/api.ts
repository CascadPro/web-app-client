export type ApiErrorCode =
	| "invalid_argument"
	| "validation_error"
	| "unauthorized"
	| "forbidden"
	| "not_found"
	| "conflict"
	| "too_many_requests"
	| "invalid_credentials"
	| "user_not_found"
	| "user_not_activated"
	| "email_already_exists"
	| "username_already_exists"
	| "client_not_found"
	| "client_already_exists"
	| "file_not_found"
	| "file_already_exists"
	| "file_access_denied"
	| "unsupported_file"
	| "file_too_large"
	| "request_not_found"
	| "request_already_exists"
	| "request_access_denied"
	| "request_already_handled"
	| "session_not_found"
	| "session_expired"
	| "session_revoked"
	| "settings_not_found"
	| "invalid_token"
	| "token_expired"
	| "internal_error"

export interface ApiErrorResponse {
	code?: string
	message?: string
	fields?: Record<string, string>
	timestamp?: string
}

export class ApiError extends Error {
	readonly code: ApiErrorCode
	readonly status: number
	readonly fields: Record<string, string>

	constructor({
		code,
		message,
		status,
		fields = {}
	}: {
		code: ApiErrorCode
		message: string
		status: number
		fields?: Record<string, string>
	}) {
		super(message)

		this.name = "ApiError"
		this.code = code
		this.status = status
		this.fields = fields
	}
}
