import type { NextConfig } from "next"

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "http",
				hostname: "192.168.3.6",
				port: "8000",
				pathname: "/media/**"
			}
		],
		unoptimized: true
	},
	allowedDevOrigins: ["192.168.3.6", "192.168.18.227", "0.0.0.0"]
}

export default nextConfig
