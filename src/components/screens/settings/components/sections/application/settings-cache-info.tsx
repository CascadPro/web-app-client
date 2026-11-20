"use client"

import type { FC } from "react"

import { Skeleton } from "@/components/ui"

import { useSettingsCache } from "../../../hooks/useSettingsCache"

import { SettingsClearButton } from "./settings-clear-button"

export const SettingsCacheInfo: FC = () => {
	const { isCacheMeasuring, totalCacheSize, isClearing, clearCache } =
		useSettingsCache()

	return (
		<div className="flex items-center justify-between gap-3">
			<span className="min-w-0 text-sm tabular-nums" aria-live="polite">
				{isCacheMeasuring ? (
					<Skeleton className="bg-surface-variant h-7 w-46" />
				) : totalCacheSize ? (
					`Доступно ${totalCacheSize} кэша`
				) : (
					"Нет доступного кэша"
				)}
			</span>

			<SettingsClearButton
				isLoading={isClearing || isCacheMeasuring}
				disabled={isClearing || !totalCacheSize}
				onClick={clearCache}
			/>
		</div>
	)
}
