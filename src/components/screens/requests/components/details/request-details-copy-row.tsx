"use client"

import { ArrowUpRightIcon } from "lucide-react"
import type { FC } from "react"

import { Skeleton } from "@/components/ui"
import { CopyIcon } from "@/components/ui/components/copy-icon"
import { MarqueeText } from "@/components/ui/components/maruquee-text"
import { cn } from "@/libs/utils"

import { useRequestCopyRow } from "../../hooks/useRequestCopyRow"

interface Props {
	value: string
	type?: string
	href?: string
	hrefLabel?: string
}

export const RequestDetailsCopyRow: FC<Props> = ({
	value: propsValue,
	type,
	href,
	hrefLabel
}) => {
	const { Icon, label, value, isLoading, isCopied, handleCopy } =
		useRequestCopyRow(propsValue, type)

	return (
		<div className="flex items-center">
			<div className="py-(--mini-row-padding-y flex min-h-14 min-w-0 flex-1 items-center gap-3 px-(--mini-row-padding-x)">
				<span className="bg-primary/10 text-primary grid size-8 shrink-0 place-items-center rounded-lg">
					<Icon size={16} aria-hidden />
				</span>

				<span className="min-w-0 flex-1">
					{label && (
						<span className="text-on-surface-variant block text-xs">
							{label}
						</span>
					)}

					{isLoading ? (
						<Skeleton className="mt-1 h-4 w-32" />
					) : (
						<MarqueeText
							className="text-sm"
							tag="div"
							shadow={false}
							options={{ speed: 0.4 }}
						>
							{value}
						</MarqueeText>
					)}
				</span>

				<CopyIcon
					size={18}
					containerCN={cn("size-5", {
						"mr-2": !href
					})}
					className="p-2"
					isCopied={isCopied}
					onCopy={handleCopy}
				/>

				<span role="status" className="sr-only">
					{isCopied ? "Скопировано" : ""}
				</span>
			</div>

			{href && (
				<a
					href={href}
					aria-label={hrefLabel}
					target={type === "url" ? "_blank" : "_self"}
					className="text-primary active:bg-primary/10 focus-visible:bg-primary/10 grid min-h-14 shrink-0 place-items-center px-(--mini-row-padding-y) transition-colors outline-none motion-reduce:transition-none"
				>
					<ArrowUpRightIcon size={18} aria-hidden />
				</a>
			)}
		</div>
	)
}
