import type { ReactNode } from "react"

import { NestedHeader } from "@/components/layouts/header/header"
import { Container } from "@/components/ui"

export default function Layout({
	children
}: Readonly<{ children: ReactNode }>) {
	return (
		<>
			<NestedHeader />

			<Container className="px-3 pt-[calc(4.5rem+env(safe-area-inset-top))]">
				{children}
			</Container>
		</>
	)
}
