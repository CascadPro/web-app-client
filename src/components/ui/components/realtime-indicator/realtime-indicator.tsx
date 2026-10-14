"use client"

import { GlobeIcon } from "lucide-react";
import { m } from "motion/react";

import { cn } from "@/libs/utils";

import { useRealtimeIndicator } from "./hook";

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
				"fixed bottom-[calc(env(safe-area-inset-bottom)+4rem)] z-100 translate-x-1/2",
				"ring-outline/30 bg-surface/50 overflow-hidden rounded-3xl shadow-2xl ring-2 backdrop-blur-xl",
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
						"relative flex size-10 shrink-0 items-center justify-center rounded-full"
					)}
				>
					<Icon
						size={isCompact ? 20 : 24}
						strokeWidth={2}
						className={cn(config.textColor, {
							"animate-spin": status === "reconnecting",
							"text-amber-500": quality === "degraded",
							"text-error": quality === "poor"
						})}
					/>

					<span
						className={cn(
							"absolute top-0.5 right-0.5 size-2 rounded-full",
							config.color,
							{
								"animate-pulse": config.pulse,
								"bg-amber-500": quality === "degraded",
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
					<div className="shrink-0 rounded-full p-1 ring-2 ring-emerald-600">
						<GlobeIcon size={16} className="text-emerald-500" />
					</div>
				)}
			</button>
		</m.div>
	)
}
