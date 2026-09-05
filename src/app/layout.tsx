import { ThemeProvider } from "next-themes"
import { JetBrains_Mono, Mulish } from "next/font/google"
import type { ReactNode } from "react"


import "./globals.css"

interface Props {
	children: ReactNode
}

const poppins = Mulish({
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

export default async function Layout({ children }: Readonly<Props>) {
	return (
		<html lang="ru" data-scroll-behavior="smooth" suppressHydrationWarning>
			<body className={`${poppins.variable} antialiased`}>
				<ThemeProvider attribute="class">
						{children}
				</ThemeProvider>
			</body>
		</html>
	)
}
