import { DatabaseIcon, RefreshCw, SmartphoneIcon } from "lucide-react"
import { type FC, memo } from "react"

import { Button } from "@/components/ui"
import { APP_VERSION } from "@/libs/constants"

import { SettingsRow } from "../settings-row"
import { SettingsSection } from "../settings-section"

interface Props {
	totalCacheSize: string | undefined
	isCacheMeasuring: boolean
	clearing: boolean
	onClearCache: () => void
}

const SettingsApplicationComponent: FC<Props> = ({
	totalCacheSize,
	isCacheMeasuring,
	clearing,
	onClearCache
}) => (
	<SettingsSection
		id="application"
		title="Приложение"
		description="Локальные данные и информация о версии"
		icon={SmartphoneIcon}
	>
		<SettingsRow
			title="Очистить кэш"
			description={`Очистить все ${isCacheMeasuring ? "-" : totalCacheSize} кэша`}
			className="flex items-center justify-between"
			icon={DatabaseIcon}
			trailing={
				<Button
					variant="default"
					className="mb-2 gap-1 p-2"
					isLoading={clearing || isCacheMeasuring}
					disabled={clearing || !totalCacheSize}
					onClick={onClearCache}
				>
					<RefreshCw
						size={16}
						className={clearing ? "animate-spin" : ""}
						aria-hidden="true"
					/>
					<span>{clearing ? "Очистка…" : "Очистить"}</span>
				</Button>
			}
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
	</SettingsSection>
)

export const SettingsApplication = memo(SettingsApplicationComponent)
SettingsApplication.displayName = "SettingsApplication"
