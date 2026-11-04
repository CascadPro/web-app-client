"use client"

import type { FC } from "react"

import { Skeleton } from "@/components/ui"

/** Повторяет раскладку формы: название, срок, контакты, два блока тегов */
export const RequestEditSkeleton: FC = () => (
	<div
		className="flex flex-col gap-9 pt-6"
		aria-busy="true"
		aria-label="Загрузка заявки"
	>
		<Skeleton className="h-12 rounded-xl" />
		<Skeleton className="h-12 rounded-xl" />
		<Skeleton className="h-24 rounded-2xl" />
		<Skeleton className="h-12 rounded-xl" />
		<Skeleton className="h-12 rounded-xl" />
	</div>
)
