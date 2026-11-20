import { API_URL } from "@/libs/constants"
import { useAuthStore } from "@/store/auth"
import axios from "axios"

export interface UploadProgressEvent {
	loaded: number
	total: number
	percent: number
}

export interface StreamingUploadOptions {
	url: string
	file: File
	tag: string
	method?: "POST" | "PATCH" | "PUT"
	headers?: Record<string, string>
	onProgress?: (event: UploadProgressEvent) => void
	signal?: AbortSignal
	/** Force fallback to FormData (e.g., for iOS Safari compatibility) */
	forceFallback?: boolean
}

export interface StreamingUploadResult {
	success: boolean
	status: number
	statusText: string
	data?: unknown
	error?: Error
}

/**
 * Checks if the current environment supports streaming uploads via fetch + ReadableStream.
 * iOS Safari and some older browsers don't support this properly.
 */
function supportsStreamingUpload(): boolean {
	// Check for ReadableStream support
	if (typeof ReadableStream === "undefined") return false

	// Check for fetch with duplex support (required for streaming bodies)
	// Test by checking if the duplex option is recognized
	try {
		// This will throw in environments that don't support duplex
		// eslint-disable-next-line no-new
		new Request("", {
			method: "POST",
			body: new ReadableStream(),
			duplex: "half",
		} as RequestInit & { duplex: "half" })
		return true
	} catch {
		return false
	}
}

/**
 * Fallback upload using axios + FormData (traditional approach).
 * Buffers the file in memory but works on all browsers including iOS Safari.
 */
async function fallbackUpload(
	options: StreamingUploadOptions,
): Promise<StreamingUploadResult> {
	const { url, file, tag, method = "POST", headers = {}, onProgress, signal } = options

	const accessToken = useAuthStore.getState().accessToken

	const formData = new FormData()
	formData.append("file", file)
	formData.append("tag", tag)

	const requestHeaders: Record<string, string> = {
		...headers,
	}

	if (accessToken) {
		requestHeaders.Authorization = `Bearer ${accessToken}`
	}

	// Create axios instance for this upload to avoid interceptor issues
	const uploadAxios = axios.create({
		baseURL: API_URL,
		headers: {
			...requestHeaders,
			"Content-Type": "multipart/form-data",
		},
	})

	try {
		const controller = new AbortController()
		const abortSignal = signal ?? controller.signal

		if (signal) {
			signal.addEventListener("abort", () => controller.abort(signal.reason))
		}

		const response = await uploadAxios.request({
			method,
			url,
			data: formData,
			signal: abortSignal,
			onUploadProgress: (event) => {
				if (event.total) {
					onProgress?.({
						loaded: event.loaded,
						total: event.total,
						percent: Math.round((event.loaded / event.total) * 100),
					})
				}
			},
			withCredentials: true,
		})

		return {
			success: response.status >= 200 && response.status < 300,
			status: response.status,
			statusText: response.statusText,
			data: response.data,
			error:
				response.status >= 200 && response.status < 300
					? undefined
					: new Error(`Upload failed: ${response.status} ${response.statusText}`),
		}
	} catch (error) {
		if (axios.isCancel(error) || (error instanceof DOMException && error.name === "AbortError")) {
			return {
				success: false,
				status: 0,
				statusText: "Aborted",
				error: new Error("Upload aborted"),
			}
		}
		return {
			success: false,
			status: 0,
			statusText: "Error",
			error: error instanceof Error ? error : new Error(String(error)),
		}
	}
}

/**
 * Performs a streaming multipart upload using fetch with ReadableStream.
 * This avoids buffering the entire file in memory, enabling efficient upload
 * of large files even on memory-constrained devices.
 * Falls back to FormData + axios for unsupported environments (iOS Safari, etc.).
 */
export async function streamingUpload(
	options: StreamingUploadOptions,
): Promise<StreamingUploadResult> {
	const { url, file, tag, headers = {}, onProgress, signal, forceFallback = false } = options

	const accessToken = useAuthStore.getState().accessToken

	// Use fallback for unsupported environments or when forced
	if (forceFallback || !supportsStreamingUpload()) {
		return fallbackUpload(options)
	}

	// Build multipart/form-data as a ReadableStream
	const boundary = `----WebKitFormBoundary${Math.random().toString(36).substring(2, 15)}`
	const CRLF = "\r\n"
	const encoder = new TextEncoder()

	// Create the multipart body parts
	const prefix = `--${boundary}${CRLF}`
	const fileHeader = `Content-Disposition: form-data; name="file"; filename="${file.name}"${CRLF}Content-Type: ${file.type || "application/octet-stream"}${CRLF}${CRLF}`
	const tagPart = `--${boundary}${CRLF}Content-Disposition: form-data; name="tag"${CRLF}${CRLF}${tag}${CRLF}`
	const suffix = `--${boundary}--${CRLF}`

	// Calculate total size for progress tracking
	const prefixBytes = encoder.encode(prefix)
	const fileHeaderBytes = encoder.encode(fileHeader)
	const tagPartBytes = encoder.encode(tagPart)
	const suffixBytes = encoder.encode(suffix)
	const totalSize =
		prefixBytes.length +
		fileHeaderBytes.length +
		file.size +
		tagPartBytes.length +
		suffixBytes.length

	let loaded = 0

	// Create a ReadableStream that yields the multipart body
	const stream = new ReadableStream<Uint8Array>({
		async start(controller) {
			// Send prefix
			controller.enqueue(prefixBytes)
			loaded += prefixBytes.length
			onProgress?.({ loaded, total: totalSize, percent: Math.round((loaded / totalSize) * 100) })

			// Send file header
			controller.enqueue(fileHeaderBytes)
			loaded += fileHeaderBytes.length
			onProgress?.({ loaded, total: totalSize, percent: Math.round((loaded / totalSize) * 100) })

			// Stream the file content in chunks
			const reader = file.stream().getReader()
			try {
				while (true) {
					if (signal?.aborted) {
						controller.error(new Error("Upload aborted"))
						return
					}
					const { done, value } = await reader.read()
					if (done) break
					controller.enqueue(value)
					loaded += value.length
					onProgress?.({ loaded, total: totalSize, percent: Math.round((loaded / totalSize) * 100) })
				}
			} finally {
				reader.releaseLock()
			}

			// Send tag part
			controller.enqueue(tagPartBytes)
			loaded += tagPartBytes.length
			onProgress?.({ loaded, total: totalSize, percent: Math.round((loaded / totalSize) * 100) })

			// Send suffix
			controller.enqueue(suffixBytes)
			loaded += suffixBytes.length
			onProgress?.({ loaded, total: totalSize, percent: 100 })

			controller.close()
		},
		cancel(reason) {
			// Clean up if stream is cancelled
		},
	})

	// Prepare request headers
	const requestHeaders: Record<string, string> = {
		"Content-Type": `multipart/form-data; boundary=${boundary}`,
		...headers,
	}

	if (accessToken) {
		requestHeaders.Authorization = `Bearer ${accessToken}`
	}

	// Perform the upload
	try {
		const controller = new AbortController()
		const abortSignal = signal ?? controller.signal

		// Forward abort signal
		if (signal) {
			signal.addEventListener("abort", () => controller.abort(signal.reason))
		}

		const response = await fetch(`${API_URL}${url}`, {
			method: options.method || "POST",
			headers: requestHeaders,
			body: stream,
			signal: abortSignal,
			credentials: "include",
			// Required for streaming request bodies (not in TS types yet)
			duplex: "half",
		} as RequestInit & { duplex: "half" })

		let data: unknown
		const contentType = response.headers.get("content-type")
		if (contentType?.includes("application/json")) {
			data = await response.json()
		} else {
			data = await response.text()
		}

		return {
			success: response.ok,
			status: response.status,
			statusText: response.statusText,
			data,
			error: response.ok ? undefined : new Error(`Upload failed: ${response.status} ${response.statusText}`),
		}
	} catch (error) {
		// If streaming fails, try fallback (e.g., network error during streaming)
		if (error instanceof TypeError && error.message.includes("duplex")) {
			return fallbackUpload(options)
		}

		if (error instanceof DOMException && error.name === "AbortError") {
			return {
				success: false,
				status: 0,
				statusText: "Aborted",
				error: new Error("Upload aborted"),
			}
		}
		return {
			success: false,
			status: 0,
			statusText: "Error",
			error: error instanceof Error ? error : new Error(String(error)),
		}
	}
}

/**
 * Creates a streaming upload function pre-configured with common options.
 * Useful for creating specialized upload functions for avatars, documents, etc.
 */
export function createStreamingUploader(defaultOptions: Partial<StreamingUploadOptions>) {
	return (options: Omit<StreamingUploadOptions, keyof typeof defaultOptions> & Partial<Pick<StreamingUploadOptions, keyof typeof defaultOptions>>) =>
		streamingUpload({ ...defaultOptions, ...options } as StreamingUploadOptions)
}

export const uploadAvatar = createStreamingUploader({
	url: "/users/avatar",
	tag: "avatars",
	method: "PATCH",
	forceFallback: true,
})

export const uploadDocument = createStreamingUploader({
	tag: "docs",
	method: "POST",
	forceFallback: true,
})