import type { ReactNode } from "react"

import { AuthProvider } from "@/components/providers/auth"
import { Container } from "@/components/ui"
import { getViewport } from "@/libs/utils"

export const viewport = getViewport(false, 1)

export default function Layout({
	children
}: Readonly<{ children: ReactNode }>) {
	return (
		<AuthProvider>
			<main>
				<Container className="px-3 py-2">{children}</Container>
			</main>
		</AuthProvider>
	)
}
