"use client"

import type { FC } from "react"

import { formatFileSize, pluralize } from "@/libs/utils/screens/request-details"

import { useSettingsOfflineFiles } from "../../../hooks/useSettingsOfflineFiles"

import { SettingsClearButton } from "./settings-clear-button"

export const SettingsOfflineFiles: FC = () => {
	const { count, bytes, isClearing, handleClear } = useSettingsOfflineFiles()

	return (
		<div className="flex items-center justify-between gap-3">
			<p className="min-w-0 text-sm tabular-nums" aria-live="polite">
				{count === 0
					? "Нет сохранённых файлов"
					: `${count} ${pluralize(count, ["файл", "файла", "файлов"])} · ${formatFileSize(bytes)}`}
			</p>

			<SettingsClearButton
				disabled={count === 0 || isClearing}
				isLoading={isClearing}
				onClick={() => void handleClear()}
			/>
		</div>
	)
}
