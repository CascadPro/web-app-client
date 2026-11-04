export type FileKind = "pdf" | "doc" | "sheet" | "image" | "archive" | "other"

const KINDS: Record<string, FileKind> = {
	pdf: "pdf",
	doc: "doc",
	docx: "doc",
	odt: "doc",
	rtf: "doc",
	txt: "doc",
	xls: "sheet",
	xlsx: "sheet",
	ods: "sheet",
	csv: "sheet",
	png: "image",
	jpg: "image",
	jpeg: "image",
	webp: "image",
	gif: "image",
	heic: "image",
	svg: "image",
	zip: "archive",
	rar: "archive",
	"7z": "archive",
	tar: "archive",
	gz: "archive"
}

export const getFileExtension = (name?: string | null): string => {
	if (!name) return ""

	const dot = name.lastIndexOf(".")

	return dot > 0 && dot < name.length - 1
		? name.slice(dot + 1).toLowerCase()
		: ""
}

export const getFileKind = (extension: string): FileKind =>
	KINDS[extension] ?? "other"

const UNITS = ["КБ", "МБ", "ГБ", "ТБ"]

/** 2 516 582 → «2,4 МБ» */
export const formatFileSize = (
	bytes?: number | null,
	locale: string = "ru-RU"
): string => {
	if (bytes === null || bytes === undefined) return ""
	if (!Number.isFinite(bytes) || bytes < 0) return ""
	if (bytes < 1024) return `${bytes}\u00A0Б`

	let value = bytes / 1024
	let unit = 0

	while (value >= 1024 && unit < UNITS.length - 1) {
		value /= 1024
		unit += 1
	}

	const formatted = new Intl.NumberFormat(locale, {
		maximumFractionDigits: value >= 100 ? 0 : 1
	}).format(value)

	return `${formatted}\u00A0${UNITS[unit]}`
}

/**
 * Адрес файла по аналогии с аватарами: {MEDIA_URL}/{tag}/{id}.
 * Если у файла нет тега, считаем его документом.
 */
export const getRequestFileUrl = (
	file: { id?: string; tag?: string },
	mediaUrl: string
): string | null =>
	file.id && mediaUrl ? `${mediaUrl}/${file.tag || "docs"}/${file.id}` : null
