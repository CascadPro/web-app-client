import { formatFileSize } from "./files"

export interface DownloadProgress {
	loaded: number
	/** null — сервер не сообщил размер, процент посчитать нельзя */
	total: number | null
}

export type FetchLike = (
	input: RequestInfo | URL,
	init?: RequestInit
) => Promise<Response>

export interface DownloadOptions {
	signal?: AbortSignal
	onProgress?: (progress: DownloadProgress) => void
	/** Подмена fetch: приложение подставляет вариант с токеном и повтором при 401 */
	fetchImpl?: FetchLike
	/** Как часто сообщать о прогрессе (мс): не перерисовываем интерфейс на каждый кусочек */
	throttleMs?: number
}

export class DownloadError extends Error {
	status: number
	serverMessage?: string

	constructor(status: number, serverMessage?: string) {
		super(serverMessage ?? `Download failed with status ${status}`)

		this.name = "DownloadError"
		this.status = status
		this.serverMessage = serverMessage
	}
}

export const isAbortError = (error: unknown): boolean =>
	typeof error === "object" &&
	error !== null &&
	"name" in error &&
	error.name === "AbortError"

const createAbortError = (): Error => {
	const error = new Error("The operation was aborted")

	error.name = "AbortError"

	return error
}

/** Процент (0–100), не больше 100 даже если размер сжатого ответа меньше настоящего */
export const toPercent = (
	loaded: number,
	total: number | null
): number | null =>
	total && total > 0
		? Math.min(100, Math.max(0, Math.round((loaded / total) * 100)))
		: null

/** «Скачивание 42% · 1 МБ из 2,4 МБ» */
export const formatDownloadProgress = (
	loaded: number,
	total: number | null
): string => {
	const percent = toPercent(loaded, total)

	if (percent === null) {
		return loaded > 0 ? `Скачано ${formatFileSize(loaded)}` : "Скачивание…"
	}

	return `Скачивание ${percent}% · ${formatFileSize(loaded)} из ${formatFileSize(total)}`
}

/** Человеческое объяснение, почему файл не скачался */
export const getDownloadErrorMessage = (error: unknown): string => {
	if (error instanceof DownloadError) {
		if (error.serverMessage) return error.serverMessage
		if (error.status === 401 || error.status === 403)
			return "Нет доступа к файлу"
		if (error.status === 404) return "Файл не найден или уже удалён"
		if (error.status >= 500) return "Сервер временно недоступен"
	}

	return "Проверьте соединение и попробуйте ещё раз"
}

const readServerMessage = async (
	response: Response
): Promise<string | undefined> => {
	try {
		const body: unknown = await response.json()

		if (
			typeof body === "object" &&
			body !== null &&
			"message" in body &&
			typeof body.message === "string"
		) {
			return body.message
		}
	} catch {
		// тело не JSON — достаточно статуса
	}

	return undefined
}

/**
 * Скачивает файл потоком и сообщает, сколько уже получено.
 * Размер берётся из Content-Length (сервер его отдаёт), отмена — через AbortSignal.
 */
export const downloadFile = async (
	url: string,
	{
		signal,
		onProgress,
		fetchImpl = fetch,
		throttleMs = 80
	}: DownloadOptions = {}
): Promise<{ blob: Blob; contentType: string }> => {
	const response = await fetchImpl(url, { signal })

	if (!response.ok) {
		throw new DownloadError(response.status, await readServerMessage(response))
	}

	const header = Number(response.headers.get("Content-Length"))
	const total = Number.isFinite(header) && header > 0 ? header : null
	const contentType =
		response.headers.get("Content-Type") || "application/octet-stream"

	// Совсем старые браузеры без потока: получаем целиком, без промежуточного прогресса
	if (!response.body) {
		const blob = await response.blob()

		onProgress?.({ loaded: blob.size, total: blob.size })

		return { blob, contentType }
	}

	const reader = response.body.getReader()
	const chunks: Uint8Array[] = []

	let loaded = 0
	let lastReport = 0

	// Отмена должна будить зависшее чтение, а не ждать следующего куска
	const onAbort = () => void reader.cancel().catch(() => {})

	signal?.addEventListener("abort", onAbort, { once: true })

	try {
		for (;;) {
			const { done, value } = await reader.read()

			if (signal?.aborted) throw createAbortError()

			if (done) break

			chunks.push(value)
			loaded += value.byteLength

			const now = Date.now()

			if (now - lastReport >= throttleMs) {
				lastReport = now
				onProgress?.({ loaded, total })
			}
		}
	} finally {
		signal?.removeEventListener("abort", onAbort)
	}

	// Последний отчёт всегда 100%: даже если размер был неизвестен или ответ сжат
	onProgress?.({
		loaded,
		total: total === null ? loaded : Math.max(total, loaded)
	})

	return {
		blob: new Blob(chunks as BlobPart[], { type: contentType }),
		contentType
	}
}

/** Сохраняет файл на устройство (системное окно загрузки / папка «Загрузки») */
export const saveBlob = (blob: Blob, filename: string): void => {
	const url = URL.createObjectURL(blob)
	const link = document.createElement("a")

	link.href = url
	link.download = filename
	link.rel = "noopener"
	link.hidden = true

	document.body.appendChild(link)
	link.click()
	link.remove()

	// Адрес нужен браузеру, пока идёт сохранение; потом освобождаем память
	setTimeout(() => URL.revokeObjectURL(url), 60_000)
}
