"use client"

import { MoveLeftIcon } from "lucide-react"
import type { ReactNode } from "react"

import { Button, Container, Title } from "@/components/ui"
import { cn } from "@/libs/utils"

import { useNestedLayout } from "./useLayout"

export default function Layout({
	children
}: Readonly<{ children: ReactNode }>) {
	const { isActive, handleBack, title } = useNestedLayout()

	return (
		<>
			<header className="fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)]">
				<div className="bg-background/40 border-outline/20 flex min-h-16 items-center gap-2 border-b p-2 backdrop-blur-lg">
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
				</div>
			</header>

			<Container className="px-3 pt-[calc(4.5rem+env(safe-area-inset-top))]">
				{children}
			</Container>
		</>
	)
}
