import { InfoIcon, PlayIcon } from "lucide-react"
import type { ReactNode } from "react"

import { Tabs } from "@/components/layouts/tabs/tabs"
import { Container, ToastProvider } from "@/components/ui"
import { AppRoutes } from "@/libs/constants"
import { getViewport } from "@/libs/utils"

export const viewport = getViewport(false, 1)

export default function Layout({
	children
}: Readonly<{ children: ReactNode }>) {
	return (
		<main>
			<Container className="px-3 py-2">{children}</Container>
			<ToastProvider />

			<Tabs
				data={[
					{
						title: "О нас",
						icon: "about",
						href: AppRoutes.ABOUT
					},
					{
						title: "Начать",
						icon: "start",
						href: AppRoutes.START
					}
				]}
			/>
		</main>
	)
}
