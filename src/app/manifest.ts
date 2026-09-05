import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "Cascade Pro App",
		short_name: "Cascade Pro",
		description: "Cascade Pro application",

		start_url: "/",
		scope: "/",

		display: "standalone",
		orientation: "portrait",

		background_color: "#ffffff",
		theme_color: "#ff9800",

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
