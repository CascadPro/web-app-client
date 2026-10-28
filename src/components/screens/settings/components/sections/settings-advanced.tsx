import { LockKeyholeIcon, Settings2Icon, ZapIcon } from "lucide-react"
import { type FC, memo } from "react"

import { Section, Switch } from "@/components/ui"
import {
	ANIMATION_OPTIONS,
	SESSION_EXPIRE_OPTIONS
} from "@/libs/constants/screens/settings"
import type { SettingsState } from "@/types/screens/settings"

import { SettingsRow } from "../settings-row"
import { SettingsSegmentedControl } from "../settings-segmented-control"

interface Props {
	settings: SettingsState
	onChange: (patch: Partial<SettingsState>) => void
}

const SettingsAdvancedComponent: FC<Props> = ({ settings, onChange }) => (
	<Section
		id="advanced"
		title="Дополнительные настройки"
		description="Анимации, безопасность и подтверждения"
		icon={Settings2Icon}
	>
		<SettingsRow
			title="Анимации"
			description="Учитывать системные настройки движения"
			icon={ZapIcon}
			trailing={
				<SettingsSegmentedControl
					label="Анимации"
					value={settings.animations}
					options={ANIMATION_OPTIONS}
					onChange={animations => onChange({ animations })}
				/>
			}
		/>

		<SettingsRow
			title="Срок действия сеанса"
			description="Период действия сеанса до истечения срока"
			icon={LockKeyholeIcon}
			trailing={
				<SettingsSegmentedControl
					label="Срок действия сеанса"
					value={settings.sessionExpireTerm}
					options={SESSION_EXPIRE_OPTIONS}
					onChange={sessionExpireTerm => onChange({ sessionExpireTerm })}
				/>
			}
		/>

		<SettingsRow
			title="Подтверждать важные действия"
			description="Показывать дополнительное подтверждение перед потенциально опасными действиями"
			icon={Settings2Icon}
			className="flex items-center justify-between"
			trailing={
				<Switch
					label="Подтверждать важные действия"
					checked={settings.confirmImportantActions}
					onCheckedChange={confirmImportantActions =>
						onChange({ confirmImportantActions })
					}
				/>
			}
		/>

		<SettingsRow
			title="Двухфакторная аутентификация"
			description="Дополнительная проверка при работе с сеансами"
			icon={LockKeyholeIcon}
			className="flex items-center justify-between"
			trailing={
				<Switch
					label="Двухфакторная аутентификация для сеансов"
					checked={settings.session2FAEnabled}
					onCheckedChange={session2FAEnabled => onChange({ session2FAEnabled })}
				/>
			}
		/>
	</Section>
)

export const SettingsAdvanced = memo(SettingsAdvancedComponent)
SettingsAdvanced.displayName = "SettingsAdvanced"
