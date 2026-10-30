import { domAnimation, LazyMotion } from "motion/react"
import type { Metadata, Viewport } from "next"
import { ThemeProvider } from "next-themes"
import { JetBrains_Mono, Nunito } from "next/font/google"
import type { ReactNode } from "react"

import { HapticProvider } from "@/components/providers/haptics"
import { MotionRoot } from "@/components/providers/motion-root"
import { ServiceWorkerRegister } from "@/components/pwa/pwa-service-worker"
import { PWASplashScreen } from "@/components/pwa/pwa-splash-screen"
import { ToastViewport } from "@/components/ui/toast/components/toast-viewport"

import "./globals.css"

interface Props {
	children: ReactNode
}

const font = Nunito({
	variable: "--font-mulish",
	subsets: ["latin", "cyrillic"],
	weight: ["300", "400", "500", "600", "700", "800"],
	fallback: ["system-ui"]
})

const jetbrains = JetBrains_Mono({
	variable: "--font-jetbrains",
	subsets: ["latin"],
	weight: ["400"],
	preload: false
})

export const metadata: Metadata = {
	applicationName: "Cascade Pro",
	appleWebApp: {
		title: "Cascade Pro",
		startupImage: "/icons/icon-512.png"
	}
}

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	viewportFit: "cover",
	themeColor: "#121212"
}

export default function Layout({ children }: Readonly<Props>) {
	return (
		<html lang="ru" data-scroll-behavior="smooth" suppressHydrationWarning>
			<body className={`${font.variable} antialiased`}>
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
					<LazyMotion features={domAnimation} strict>
						<MotionRoot>
							<PWASplashScreen>{children}</PWASplashScreen>

							<ToastViewport />
						</MotionRoot>
					</LazyMotion>
				</ThemeProvider>

				<HapticProvider />
				<ServiceWorkerRegister />
			</body>
		</html>
	)
}
