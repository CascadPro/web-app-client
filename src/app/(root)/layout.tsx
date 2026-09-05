import type { ReactNode } from "react"

import { Container } from "@/components/ui"

export default function Layout({
	children
}: Readonly<{ children: ReactNode }>) {
	return (
		<main>
			<Container className="p-3">{children}</Container>
		</main>
	)
}
