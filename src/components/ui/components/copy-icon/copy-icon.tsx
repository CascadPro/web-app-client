"use client"

import { Check, Copy } from "lucide-react"
import { AnimatePresence, m } from "motion/react"
import { type FC, memo } from "react"

import { Button } from "@/components/ui"
import { cn } from "@/libs/utils"

import {
	COPY_ICON_SPARK_TRANSITION,
	COPY_ICON_SPARKS,
	COPY_ICON_TRANSITION,
	useCopyIcon
} from "./"

interface ProfileCopyIconProps {
	isCopied: boolean
	disabled?: boolean
	notify?: boolean
	onCopy: () => Promise<void>
	size?: number
}

const CopyIconComponent: FC<ProfileCopyIconProps> = ({
	isCopied,
	disabled = false,
	notify = true,
	size = 24,
	onCopy
}) => {
	const { reduceMotion, burst, handleClick } = useCopyIcon(
		disabled,
		notify,
		onCopy
	)

	return (
		<span
			className={`relative inline-flex size-${size / 2} shrink-0 items-center justify-center`}
		>
			<Button
				variant="ghost"
				disabled={disabled}
				onClick={handleClick}
				aria-label={isCopied ? "Данные скопированы" : "Скопировать данные"}
				title={isCopied ? "Скопировано" : "Скопировать данные"}
				className={cn(
					"relative z-10 overflow-visible rounded-md p-0",
					`size-${size / 2} min-h-${size / 2} min-w-${size / 2}`,
					"text-on-surface-variant transition-colors duration-150",
					"active:bg-primary/15 hover:bg-primary/10 hover:text-primary",
					{ "bg-primary/10 text-primary": isCopied }
				)}
			>
				<AnimatePresence mode="wait" initial={false}>
					{isCopied ? (
						<m.span
							key="copied"
							initial={
								reduceMotion ? false : { opacity: 0, scale: 0.65, rotate: -25 }
							}
							animate={{ opacity: 1, scale: 1, rotate: 0 }}
							exit={
								reduceMotion
									? undefined
									: { opacity: 0, scale: 0.75, rotate: 20 }
							}
							transition={COPY_ICON_TRANSITION}
							className="inline-flex items-center justify-center"
						>
							<Check size={size} strokeWidth={2.5} aria-hidden="true" />
						</m.span>
					) : (
						<m.span
							key="copy"
							initial={
								reduceMotion ? false : { opacity: 0, scale: 0.8, rotate: 15 }
							}
							animate={{ opacity: 1, scale: 1, rotate: 0 }}
							exit={
								reduceMotion
									? undefined
									: { opacity: 0, scale: 0.75, rotate: -15 }
							}
							transition={COPY_ICON_TRANSITION}
							className="inline-flex items-center justify-center"
						>
							<Copy size={size} aria-hidden="true" />
						</m.span>
					)}
				</AnimatePresence>
			</Button>

			<AnimatePresence>
				{burst !== null && !reduceMotion && (
					<m.span
						key={burst}
						aria-hidden="true"
						className="pointer-events-none absolute inset-0 z-20"
						initial={{ opacity: 1 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0, transition: { duration: 0.08 } }}
					>
						{COPY_ICON_SPARKS.map(spark => (
							<m.span
								key={spark.id}
								className={`bg-primary absolute top-1/2 left-1/2 rounded-full`}
								initial={{
									x: 0,
									y: 0,
									opacity: 0,
									scale: 0.4
								}}
								style={{
									width: `${(size / 60).toFixed(3)}rem`,
									height: `${(size / 60).toFixed(3)}rem`
								}}
								animate={{
									x: spark.x,
									y: spark.y,
									opacity: [0, 1, 0],
									scale: [0.4, 1, 0.2]
								}}
								transition={{
									...COPY_ICON_SPARK_TRANSITION,
									delay: spark.delay
								}}
							/>
						))}
					</m.span>
				)}
			</AnimatePresence>
		</span>
	)
}

export const CopyIcon = memo(CopyIconComponent)
CopyIcon.displayName = "ProfileCopyIcon"
