import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
	return {
		id: "/",
		name: "Cascade Pro",
		short_name: "Cascade",
		description: "Управление заявками и сессиями Cascade Pro",

		start_url: "/",
		scope: "/",
		lang: "ru",

		display: "standalone",
		background_color: "#121212",
		theme_color: "#121212",

		icons: [
			{
				src: "/icons/icon-192.png",
				sizes: "192x192",
				type: "image/png",
				purpose: "any"
			},
			{
				src: "/icons/icon-512.png",
				sizes: "512x512",
				type: "image/png",
				purpose: "any"
			},
			{
				src: "/icons/icon-maskable-512.png",
				sizes: "512x512",
				type: "image/png",
				purpose: "maskable"
			}
		]
	}
}
