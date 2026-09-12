"use client"

import { MoveLeftIcon } from "lucide-react"
import type { ReactNode } from "react"

import { QueryProvider } from "@/components/providers/query"
import { Button, Container, Title } from "@/components/ui"
import { cn } from "@/libs/utils"

import { useNestedLayout } from "./useLayout"

export default function Layout({
	children
}: Readonly<{ children: ReactNode }>) {
	const { isActive, handleBack, title } = useNestedLayout()

	return (
		<QueryProvider>
			<header className="flex items-center gap-2 p-2">
				<Button
					variant="ghost"
					className="active:bg-tertiary/40 hover:bg-tertiary/40 rounded-full p-2"
					onClick={handleBack}
				>
					<MoveLeftIcon
						size={24}
						className={cn(
							"transition-transform duration-300 will-change-auto",
							isActive && "-translate-x-10"
						)}
					/>
				</Button>

				<Title size="xl" className="text-xl">
					{title}
				</Title>
			</header>

			<Container className="px-3 py-2">{children}</Container>
		</QueryProvider>
	)
}
