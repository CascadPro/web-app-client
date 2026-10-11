import type { Metadata } from "next"
import type { ReactNode } from "react"

import { Tabs, TabsData } from "@/components/layouts/tabs/tabs"
import { AuthProvider } from "@/components/providers/auth"
import { QueryProvider } from "@/components/providers/query"
import { RealtimeProvider } from "@/components/providers/realtime"
import { ToastProvider } from "@/components/ui"
import { AppRoutes, NO_INDEX_PAGE } from "@/libs/constants"
import { getViewport } from "@/libs/utils"

export const viewport = getViewport(false, 1)

export const metadata: Metadata = NO_INDEX_PAGE

const data: TabsData[] = [
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
]

export default function Layout({
	children
}: Readonly<{ children: ReactNode }>) {
	return (
		<QueryProvider>
			<AuthProvider>
				<RealtimeProvider>
					<main className="mb-24 sm:mb-0 sm:pt-4">
						{children}

						<ToastProvider />

						<Tabs data={data} />
					</main>
				</RealtimeProvider>
			</AuthProvider>
		</QueryProvider>
	)
}
