import path from "node:path"

export const DOMAIN = process.env["NEXT_PUBLIC_DOMAIN"] || ""

export const SERVER_URL = process.env["NEXT_PUBLIC_SERVER_URL"] || ""
export const API_URL = path.join(SERVER_URL, "api", "v1")
export const MEDIA_URL = path.join(SERVER_URL, "media")
