const CACHE_NAME = "cascade-static-v1"

const OFFLINE_URL = "/offline"

self.addEventListener("install", event => {
	event.waitUntil(
		caches.open(CACHE_NAME).then(cache => {
			return cache.addAll([OFFLINE_URL])
		})
	)

	self.skipWaiting()
})

self.addEventListener("activate", event => {
	event.waitUntil(
		Promise.all([
			self.clients.claim(),

			caches
				.keys()
				.then(keys =>
					Promise.all(
						keys
							.filter(key => key !== CACHE_NAME)
							.map(key => caches.delete(key))
					)
				)
		])
	)
})

self.addEventListener("fetch", event => {
	const request = event.request

	if (request.method !== "GET") {
		return
	}

	const url = new URL(request.url)

	// Только наш origin
	if (url.origin !== self.location.origin) {
		return
	}

	// API никогда не кэшируем
	if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/graphql")) {
		return
	}

	// Next.js RSC / Server Actions не кэшируем
	if (request.headers.get("RSC") || request.headers.get("Next-Action")) {
		return
	}

	// Статика
	if (
		url.pathname.startsWith("/_next/static/") ||
		url.pathname.startsWith("/icons/")
	) {
		event.respondWith(cacheFirst(request))
		return
	}

	// Картинки
	if (request.destination === "image") {
		event.respondWith(cacheFirst(request))
		return
	}

	// Страницы
	if (request.mode === "navigate") {
		event.respondWith(networkFirst(request))
		return
	}
})

async function cacheFirst(request) {
	const cached = await caches.match(request)

	if (cached) {
		return cached
	}

	const response = await fetch(request)

	if (response.ok) {
		const cache = await caches.open(CACHE_NAME)
		await cache.put(request, response.clone())
	}

	return response
}

async function networkFirst(request) {
	try {
		const response = await fetch(request)

		if (response.ok) {
			const cache = await caches.open(CACHE_NAME)
			await cache.put(request, response.clone())
		}

		return response
	} catch {
		return (await caches.match(request)) ?? (await caches.match(OFFLINE_URL))
	}
}
