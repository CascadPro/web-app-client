"use client"

import { XIcon } from "lucide-react"
import { m } from "motion/react"
import { type FC, memo } from "react"

import { DURATION, EASE_OUT } from "@/libs/motion"
import { cn } from "@/libs/utils"

import { TOAST_TYPE_ACCENTS, TOAST_TYPE_ICONS } from "../constants"
import { useToastItem } from "../hooks/useToastItem"
import type { ToastData } from "../types"

interface Props {
	item: ToastData
}

export const ToastItem: FC<Props> = memo(({ item }) => {
	const {
		reduceMotion,
		remaining,
		paused,
		setPaused,
		handleClick,
		handleClose
	} = useToastItem(item)

	const Icon = TOAST_TYPE_ICONS[item.type]
	const accent = TOAST_TYPE_ACCENTS[item.type] as string

	return (
		<m.article
			layout={!reduceMotion}
			initial={
				reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12, scale: 0.97 }
			}
			animate={{ opacity: 1, y: 0, scale: 1 }}
			exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }}
			transition={{
				duration: reduceMotion ? 0.01 : DURATION.base,
				ease: EASE_OUT
			}}
			role={item.type === "error" ? "alert" : "status"}
			aria-live={item.type === "error" ? "assertive" : "polite"}
			onClick={handleClick}
			onMouseEnter={() => setPaused(true)}
			onMouseLeave={() => setPaused(false)}
			onFocusCapture={() => setPaused(true)}
			onBlurCapture={event => {
				if (!event.currentTarget.contains(event.relatedTarget)) {
					setPaused(false)
				}
			}}
			className={cn(
				"group text-on-surface glass-thick relative isolate flex items-center overflow-hidden",
				{
					"w-fit gap-10 place-self-center rounded-2xl px-2 py-1.5":
						item.miniature,
					"glass-highlight w-full gap-3 rounded-3xl p-4": !item.miniature
				},
				item.className
			)}
		>
			<div
				className={cn(`relative grid shrink-0 place-items-center ${accent}`, {
					"rounded-full p-1": item.miniature,
					"rounded-xl p-2 ring-1": !item.miniature
				})}
			>
				<Icon
					size={22}
					strokeWidth={2}
					className={
						item.type === "loading"
							? "animate-spin motion-reduce:animate-none"
							: ""
					}
					aria-hidden="true"
				/>
			</div>

			<div className="min-w-0 flex-1">
				<p className="font-semibold">{item.title}</p>

				{item.description && (
					<p className="text-on-surface-variant mt-1 mb-2 text-sm leading-3.5">
						{item.description}
					</p>
				)}
			</div>

			{item.dismissible && (
				<button
					type="button"
					onClick={handleClose}
					aria-label="Закрыть уведомление"
					className="text-on-surface-variant hover:bg-on-surface/5 hover:text-on-surface focus-visible:ring-primary active:text-on-background -mr-1 grid shrink-0 place-items-center rounded-lg p-1 ring-2 ring-transparent transition-ui will-change-auto active:scale-80 motion-reduce:transition-none"
				>
					<XIcon size={24} />
				</button>
			)}

			{remaining > 0 && (
				<m.div
					aria-hidden="true"
					className="bg-primary/50 absolute inset-x-0 bottom-0 h-0.5 origin-left"
					initial={{ scaleX: 1 }}
					animate={{ scaleX: paused ? undefined : 0 }}
					transition={{
						duration: paused ? 0 : remaining / 1000,
						ease: "linear"
					}}
				/>
			)}
		</m.article>
	)
})
