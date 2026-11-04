import type { DomainRequestOriginType } from "@/api/generated"

export const REQUEST_FORM_LIMITS = {
	TITLE_MAX: 255,
	ORIGIN_MAX_ITEMS: 3,
	ORIGIN_VALUE_MAX: 255,
	TAGS_MAX_ITEMS: 10,
	TAG_MAX_LENGTH: 64
} as const

export const REQUEST_DRAFT_KEY = "cascade:request-create:draft:v1"
export const REQUEST_DRAFT_TTL = 1000 * 60 * 60 * 24 * 7
export const REQUEST_DRAFT_SAVE_DELAY = 500

export const REQUEST_OFFLINE_QUEUE_KEY = "cascade:request-create:queue:v1"
export const REQUEST_OFFLINE_QUEUE_MAX = 20

export const REQUEST_CREATE_SUCCESS_DELAY = 900
export const REQUEST_CREATE_ERROR_RESET_DELAY = 600
export const REQUEST_DRAFT_NOTICE_DURATION = 4000

interface OriginInputConfig {
	placeholder: string
	inputType: "email" | "tel" | "text"
	inputMode: "email" | "tel" | "text"
	autoComplete: string
}

export const REQUEST_ORIGIN_INPUTS: Record<
	DomainRequestOriginType,
	OriginInputConfig
> = {
	email: {
		placeholder: "name@company.ru",
		inputType: "email",
		inputMode: "email",
		autoComplete: "off"
	},
	phone: {
		placeholder: "+7 900 000-00-00",
		inputType: "tel",
		inputMode: "tel",
		autoComplete: "off"
	},
	other: {
		placeholder: "Мессенджер, ссылка или заметка",
		inputType: "text",
		inputMode: "text",
		autoComplete: "off"
	}
}

export const REQUEST_TAG_HINTS = {
	duplicate: "Такое значение уже добавлено",
	limit: `Можно добавить не более ${REQUEST_FORM_LIMITS.TAGS_MAX_ITEMS}`,
	length: `Не более ${REQUEST_FORM_LIMITS.TAG_MAX_LENGTH} символов`
} as const

export const REQUEST_CREATE_FORM_ID = "request-create-form"

export const REQUEST_CREATE_SUBMIT_LABELS = {
	default: "Создать заявку",
	loading: "Создать заявку",
	success: "Готово",
	queued: "Сохранено",
	error: "Повторить"
} as const

export const REQUEST_EDIT_SUBMIT_LABELS = {
	default: "Сохранить",
	loading: "Сохранить",
	success: "Сохранено",
	queued: "Сохранено",
	error: "Повторить"
} as const

export const REQUEST_EDIT_FORM_ID = "request-edit-form"
