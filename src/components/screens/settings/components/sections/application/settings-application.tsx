import { DatabaseIcon, HardDriveIcon, SmartphoneIcon } from "lucide-react"
import { type FC, memo } from "react"

import { Section } from "@/components/ui"
import { APP_VERSION } from "@/libs/constants"

import { SettingsRow } from "../../settings-row"

import { SettingsCacheInfo } from "./settings-cache-info"
import { SettingsOfflineFiles } from "./settings-offline-files"

const SettingsApplicationComponent: FC = () => (
	<Section
		id="application"
		title="Приложение"
		description="Локальные данные и информация о версии"
		icon={SmartphoneIcon}
	>
		<SettingsRow
			title="Локальные данные (кэш)"
			description="Временные файлы для ускорения работы приложения"
			icon={DatabaseIcon}
			trailing={<SettingsCacheInfo />}
		/>

		<SettingsRow
			title="Файлы на устройстве"
			description="Скачанные документы хранятся на устройстве"
			icon={HardDriveIcon}
			trailing={<SettingsOfflineFiles />}
		/>

		<SettingsRow
			title="Версия"
			description="Текущая версия клиента"
			className="flex items-center justify-between"
			icon={SmartphoneIcon}
			trailing={
				<p className="text-on-surface-variant mb-2 text-sm">{APP_VERSION}</p>
			}
		/>
	</Section>
)

export const SettingsApplication = memo(SettingsApplicationComponent)
SettingsApplication.displayName = "SettingsApplication"
