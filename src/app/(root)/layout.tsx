import type { ReactNode } from "react"

import { Container, ToastProvider } from "@/components/ui"
import { getViewport } from "@/libs/utils"

export const viewport = getViewport(false, 1)

export default function Layout({
	children
}: Readonly<{ children: ReactNode }>) {
	return (
		<main>
			<Container className="px-3 py-2">{children}</Container>

			<ToastProvider />
		</main>
	)
}
