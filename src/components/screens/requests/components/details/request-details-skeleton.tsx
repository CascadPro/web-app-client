"use client"

import type { FC } from "react"

import { Skeleton } from "@/components/ui"

/** Повторяет форму настоящего содержимого, чтобы при загрузке ничего не «прыгало» */
export const RequestDetailsSkeleton: FC = () => (
	<div
		className="flex flex-col gap-5 pt-2"
		aria-busy="true"
		aria-label="Загрузка"
	>
		<div className="flex flex-col gap-3">
			<Skeleton className="h-7 w-4/5" />
			<Skeleton className="h-4 w-1/2" />
			<Skeleton className="h-10 w-full rounded-xl" />
			<Skeleton className="h-1.5 w-full rounded-full" />
		</div>

		{[3, 2, 4].map(rows => (
			<div key={rows} className="flex flex-col gap-2">
				<Skeleton className="h-4 w-28" />
				<Skeleton
					className="rounded-2xl"
					style={{ height: `${rows * 3}rem` }}
				/>
			</div>
		))}
	</div>
)
