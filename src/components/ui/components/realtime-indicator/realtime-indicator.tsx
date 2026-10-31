"use client"

import { m } from "motion/react"
import { FC, memo } from "react"

import { cn } from "@/libs/utils"
import { ConnectionQuality } from "@/types/store"

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
				"fixed bottom-[calc(env(safe-area-inset-bottom)+4rem)] z-100 translate-x-1/2",
				"glass-thick overflow-hidden rounded-3xl",
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
							"animate-spin motion-reduce:animate-none":
								status === "reconnecting",
							"text-warning": quality === "degraded",
							"text-error": quality === "poor"
						})}
					/>

					{isCompact && (
						<IndicatorDot
							className="absolute top-1.5 right-0.5 size-2"
							color={config.color}
							quality={quality}
						/>
					)}
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
					<IndicatorDot
						className="size-3 shrink-0"
						color={config.color}
						quality={quality}
					/>
				)}
			</button>
		</m.div>
	)
}

interface IndicatorDotProps {
	color: string
	quality: ConnectionQuality
	className?: string
}

const IndicatorDot: FC<IndicatorDotProps> = memo(
	({ color, quality, className }) => {
		const commonCN = cn(color, {
			"bg-warning": quality === "degraded",
			"bg-error": quality === "poor"
		})

		return (
			<div
				className={cn(
					"relative rounded-full *:rounded-full motion-reduce:*:animate-none!",
					className
				)}
			>
				<div className={cn("absolute size-full", commonCN)} />
				<div className={cn("size-full animate-ping", commonCN)} />
			</div>
		)
	}
)
