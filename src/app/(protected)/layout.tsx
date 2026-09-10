import type { ReactNode } from "react"

import { Tabs } from "@/components/layouts/tabs/tabs"
import { AuthProvider } from "@/components/providers/auth"
import { Container } from "@/components/ui"
import { AppRoutes } from "@/libs/constants"
import { getViewport } from "@/libs/utils"

export const viewport = getViewport(false, 1)

export default function Layout({
	children
}: Readonly<{ children: ReactNode }>) {
	return (
		<AuthProvider>
			<main>
				<Container className="px-3 py-2">{children}</Container>

				<Tabs
					data={[
						{
							title: "Дом",
							icon: "home",
							href: AppRoutes.INDEX
						},
						{
							title: "Меню",
							icon: "menu",
							href: AppRoutes.MENU
						}
					]}
				/>
			</main>
		</AuthProvider>
	)
}
