export type TContentTypes = "json" | "image" | "form-data"

export function getContentType(type: TContentTypes) {
	let contentType: string = "application/json"

	if (type === "form-data") contentType = "multipart/form-data"
	else if (type === "image") contentType = "image/webp"

	return { "Content-Type": contentType }
}
