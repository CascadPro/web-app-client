"use client"

import { AnimatePresence, m } from "motion/react"

import { cn } from "@/libs/utils"

import { useRealtimeIndicator } from "./hook"

export function RealtimeStatusIndicator() {
	const { Icon, status, description, config, visible } = useRealtimeIndicator()

	return (
		<AnimatePresence>
			{visible && (
				<m.div
					initial={{ opacity: 0, y: 20, scale: 0.96 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					exit={{ opacity: 0, y: 12, scale: 0.96 }}
					transition={{
						type: "spring",
						stiffness: 420,
						damping: 32
					}}
					className="fixed bottom-[calc(env(safe-area-inset-bottom)+5.5rem)] left-1/2 z-100 w-[calc(100%-2rem)] max-w-88 -translate-x-1/2"
				>
					<div className="border-outline/30 bg-surface flex items-center gap-3 rounded-full border-2 px-5 py-4 shadow-2xl">
						<div className="bg-surface-variant relative flex size-9 shrink-0 items-center justify-center rounded-full">
							<Icon
								size={20}
								strokeWidth={2}
								className={cn(config.textColor, {
									"animate-spin": status === "reconnecting"
								})}
							/>

							{config.pulse && (
								<span
									className={`absolute top-0.5 right-0.5 size-2 animate-pulse rounded-full ${config.color}`}
								/>
							)}
						</div>

						<div className="min-w-0 flex-1">
							<p className="text-on-surface leading-5 font-semibold">
								{config.label}
							</p>

							<p className="text-on-surface-variant truncate text-sm leading-4">
								{description}
							</p>
						</div>

						{status === "online" && (
							<span className="size-2 shrink-0 rounded-full bg-emerald-400" />
						)}
					</div>
				</m.div>
			)}
		</AnimatePresence>
	)
}
