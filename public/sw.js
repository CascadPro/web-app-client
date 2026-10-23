const VERSION = "v3"

const CACHE_PREFIX = "cascade-pwa-"
const STATIC_CACHE = `${CACHE_PREFIX}static-${VERSION}`
const ICON_CACHE = `${CACHE_PREFIX}icons-${VERSION}`
const OFFLINE_CACHE = `${CACHE_PREFIX}offline-${VERSION}`

const OFFLINE_PATH = "/offline"
const MAX_STATIC_ENTRIES = 180
const MAX_ICON_ENTRIES = 60

self.addEventListener("install", event => {
	event.waitUntil(
		(async () => {
			const cache = await caches.open(OFFLINE_CACHE)

			try {
				const response = await fetch(OFFLINE_PATH, {
					cache: "no-store",
					credentials: "same-origin",
					headers: {
						"X-PWA-Offline-Prefetch": "1"
					}
				})

				if (response.ok && response.status === 200) {
					await cache.put(OFFLINE_PATH, response)
				}
			} catch (error) {
				console.warn("[PWA] Offline page prefetch failed", error)
			}
		})()
	)
})

self.addEventListener("activate", event => {
	event.waitUntil(
		(async () => {
			const keep = new Set([STATIC_CACHE, ICON_CACHE, OFFLINE_CACHE])

			const keys = await caches.keys()

			await Promise.all(
				keys
					.filter(key => key.startsWith(CACHE_PREFIX) && !keep.has(key))
					.map(key => caches.delete(key))
			)

			await self.clients.claim()
		})()
	)
})

self.addEventListener("message", event => {
	if (event.origin !== process.env.NEXT_PUBLIC_APP_URL) {
		return
	}

	if (event.data?.type === "SKIP_WAITING") {
		self.skipWaiting()
	}

	if (event.data?.type === "CACHE_OFFLINE_PAGE") {
		event.waitUntil(cacheOfflinePage())
	}
})

async function cacheOfflinePage() {
	const response = await fetch(OFFLINE_PATH, {
		cache: "no-store",
		credentials: "same-origin"
	})

	if (response.ok && response.status === 200) {
		const cache = await caches.open(OFFLINE_CACHE)
		await cache.put(OFFLINE_PATH, response)
	}
}

self.addEventListener("fetch", event => {
	const request = event.request

	if (request.method !== "GET") return

	const url = new URL(request.url)

	if (url.origin !== self.location.origin) return

	if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/graphql")) {
		return
	}

	if (
		request.headers.has("RSC") ||
		request.headers.has("Next-Action") ||
		request.headers.has("Next-Router-Prefetch") ||
		request.headers.has("Next-Router-State-Tree") ||
		url.searchParams.has("_rsc")
	) {
		return
	}

	if (url.pathname.startsWith("/_next/static/")) {
		event.respondWith(cacheFirst(request, STATIC_CACHE, MAX_STATIC_ENTRIES))
		return
	}

	if (url.pathname.startsWith("/icons/") && request.destination === "image") {
		event.respondWith(cacheFirst(request, ICON_CACHE, MAX_ICON_ENTRIES))
		return
	}

	if (request.mode === "navigate") {
		event.respondWith(networkNavigation(request))
	}
})

async function networkNavigation(request) {
	try {
		return await fetch(request)
	} catch {
		const cache = await caches.open(OFFLINE_CACHE)
		const offlinePage = await cache.match(OFFLINE_PATH)

		if (offlinePage) {
			return offlinePage
		}

		return new Response(
			"Нет подключения к интернету. Откройте приложение онлайн, чтобы загрузить офлайн-страницу.",
			{
				status: 503,
				headers: {
					"Content-Type": "text/plain; charset=utf-8",
					"Cache-Control": "no-store"
				}
			}
		)
	}
}

async function cacheFirst(request, cacheName, maxEntries) {
	const cache = await caches.open(cacheName)
	const cached = await cache.match(request)

	if (cached) return cached

	const response = await fetch(request)

	if (response.ok && response.status === 200) {
		await cache.put(request, response.clone())
		await trimCache(cacheName, maxEntries)
	}

	return response
}

async function trimCache(cacheName, maxEntries) {
	const cache = await caches.open(cacheName)
	const keys = await cache.keys()

	if (keys.length <= maxEntries) return

	await Promise.all(
		keys
			.slice(0, keys.length - maxEntries)
			.map(request => cache.delete(request))
	)
}
