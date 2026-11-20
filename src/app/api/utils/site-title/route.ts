import { decode } from "html-entities"
import { NextResponse } from "next/server"
import { z } from "zod"

import { isDev, ms } from "@/libs/utils"

interface CacheData {
	title: string | null
	expiresAt: number
}

const CACHE = new Map<string, CacheData>()

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url)
	const targetUrl = searchParams.get("url")

	if (!targetUrl) {
		return NextResponse.json({ title: null }, { status: 400 })
	}

	const urlValidation = z.url().safeParse(targetUrl)

	if (!urlValidation.success) {
		return NextResponse.json({ title: null }, { status: 400 })
	}

	const url = URL.parse(urlValidation.data)!

	if (CACHE.has(url.toJSON())) {
		const cache = CACHE.get(url.toJSON())!

		if (cache.expiresAt > Date.now()) {
			return NextResponse.json({ title: cache.title })
		}
	}

	const controller = new AbortController()
	const timeoutId = setTimeout(() => controller.abort(), 5000)

	try {
		const response = await fetch(urlValidation.data, {
			signal: controller.signal,
			headers: {
				"User-Agent":
					"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
				Accept: "text/html,application/xhtml+xml,application/xml;q=0.9"
			}
		})

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`)
		}

		const html = await response.text()

		const match = html.match(/<title[^>]*>(.*?)<\/title>/i)

		let title = match ? match[1].trim() : null

		if (title) {
			title = decode(title)
		}

		CACHE.set(url.toJSON(), {
			title,
			expiresAt: Date.now() + ms("7d")
		})

		return NextResponse.json({ title })
	} catch (error: any) {
		if (isDev()) {
			console.error("Failed to get site title!", error)
		}

		const status = error.name === "AbortError" ? 408 : 500
		return NextResponse.json({ title: null }, { status })
	} finally {
		clearTimeout(timeoutId)
	}
}
