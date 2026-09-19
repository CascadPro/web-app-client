import type { Metadata } from "next"
import type { ReactNode } from "react"

import { Tabs } from "@/components/layouts/tabs/tabs"
import { AuthProvider } from "@/components/providers/auth"
import { QueryProvider } from "@/components/providers/query"
import { RealtimeProvider } from "@/components/providers/realtime"
import { ToastProvider } from "@/components/ui"
import { AppRoutes, NO_INDEX_PAGE } from "@/libs/constants"
import { getViewport } from "@/libs/utils"

export const viewport = getViewport(false, 1)

export const metadata: Metadata = NO_INDEX_PAGE

export default function Layout({
	children
}: Readonly<{ children: ReactNode }>) {
	return (
		<QueryProvider>
			<AuthProvider>
				<RealtimeProvider>
					<main>
						{children}

						<ToastProvider />

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
				</RealtimeProvider>
			</AuthProvider>
		</QueryProvider>
	)
}
