"use client"

import { m } from "motion/react"

import { cn } from "@/libs/utils"

import { useRealtimeIndicator } from "./hook"

export function RealtimeStatusIndicator() {
	const {
		Icon,
		status,
		quality,
		description,
		config,
		visible,
		collapsed,
		setCollapsed
	} = useRealtimeIndicator()

	const isCompact = status === "online" && collapsed

	return (
		<m.div
			initial={false}
			transition={{
				width: {
					type: isCompact ? "tween" : "spring",
					damping: isCompact ? undefined : 16,
					duration: isCompact ? 0.2 : 0.4
				},
				right: { delay: isCompact ? 0.2 : 0 }
			}}
			className={cn(
				"fixed bottom-[calc(env(safe-area-inset-bottom)+5.5rem)] z-100 translate-x-1/2",
				"border-outline/30 bg-surface overflow-hidden rounded-2xl border-2 shadow-2xl",
				!visible && "pointer-events-none",
				isCompact && "mr-8 flex items-center justify-center"
			)}
			style={{ transformOrigin: "right center" }}
			animate={{
				width: isCompact ? 48 : "min(calc(100vw - 2rem), 352px)",
				right: isCompact ? "0" : "50%",
				opacity: visible ? 1 : 0
			}}
		>
			<button
				type="button"
				onClick={() => {
					if (status === "online") {
						setCollapsed(value => !value)
					}
				}}
				aria-label={
					isCompact
						? "Развернуть статус соединения"
						: "Свернуть статус соединения"
				}
				aria-expanded={!isCompact}
				className={cn(
					"flex w-full items-center gap-3 overflow-hidden px-5 py-4 text-left",
					{ "size-12 justify-center p-0": isCompact }
				)}
			>
				<div
					className={cn(
						"bg-surface-variant relative flex size-10 shrink-0 items-center justify-center rounded-full"
					)}
				>
					<Icon
						size={isCompact ? 20 : 24}
						strokeWidth={2}
						className={cn(config.textColor, {
							"animate-spin": status === "reconnecting",
							"text-primary": quality === "degraded",
							"text-error": quality === "poor"
						})}
					/>

					<span
						className={cn(
							"absolute top-0.5 right-0.5 size-2 rounded-full",
							config.color,
							{
								"animate-pulse": config.pulse,
								"bg-primary": quality === "degraded",
								"bg-error": quality === "poor"
							}
						)}
					/>
				</div>

				{!isCompact && (
					<div className="min-w-0 flex-1">
						<p className="text-on-surface leading-5 font-semibold">
							{config.label}
						</p>

						<p className="text-on-surface-variant truncate text-sm leading-4">
							{description}
						</p>
					</div>
				)}

				{!isCompact && status === "online" && (
					<span className="size-2 shrink-0 rounded-full bg-emerald-400" />
				)}
			</button>
		</m.div>
	)
}
