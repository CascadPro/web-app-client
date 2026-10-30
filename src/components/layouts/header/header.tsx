"use client"

import { m } from "motion/react"
import { memo } from "react"

import { Button, Title } from "@/components/ui"
import { cn } from "@/libs/utils"

import { useNestedHeader } from "./hook"

export const NestedHeader = memo(() => {
	const { Icon, title, isActive, reduceMotion, isIOS, handleBack } =
		useNestedHeader()

	return (
		<header className="fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)]">
			<div
				className={cn("flex min-h-16 items-center p-2", {
					"bg-background/40 border-outline/20 gap-2 border-b backdrop-blur-lg":
						!isIOS,
					"header-background pt-3": isIOS
				})}
			>
				<Button
					variant="ghost"
					className={cn("rounded-full p-2.5", {
						"active:bg-secondary/40 hover:bg-secondary/40": !isIOS,
						"glass glass-highlight absolute border-none! duration-200 hover:scale-[.98] hover:before:opacity-0 hover:after:opacity-0 active:scale-90 active:before:opacity-0 active:after:opacity-0":
							isIOS
					})}
					onClick={handleBack}
				>
					<Icon
						size={24}
						className={cn(
							"transition-transform duration-300 will-change-auto motion-reduce:transition-none",
							isActive && "-translate-x-12"
						)}
					/>
				</Button>

				<m.div
					key={title}
					className={cn("min-w-0", { "w-full": isIOS })}
					initial={reduceMotion ? false : { opacity: 0, y: 6 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
				>
					<Title
						size="xl"
						className={cn("text-xl", { "w-full text-center": isIOS })}
					>
						{title}
					</Title>
				</m.div>
			</div>
		</header>
	)
})
