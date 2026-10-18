import { MonitorIcon, PaletteIcon, SunIcon, ZapIcon } from "lucide-react"
import { type FC, memo } from "react"

import { Section } from "@/components/ui"
import {
	ACCENT_OPTIONS,
	ANIMATION_OPTIONS,
	DENSITY_OPTIONS,
	THEME_OPTIONS
} from "@/libs/constants/screens/settings"
import { SettingsState } from "@/types/screens/settings"

import { SettingsRow } from "../settings-row"
import { SettingsSegmentedControl } from "../settings-segmented-control"

interface Props {
	settings: SettingsState
	onChange: (patch: Partial<SettingsState>) => void
}

const SettingsAppearanceComponent: FC<Props> = ({ settings, onChange }) => (
	<Section
		id="appearance"
		title="Внешний вид"
		description="Персонализируйте интерфейс"
		icon={PaletteIcon}
	>
		<SettingsRow
			title="Тема"
			description="Светлая, тёмная или системная"
			icon={SunIcon}
			trailing={
				<SettingsSegmentedControl
					label="Тема интерфейса"
					value={settings.theme}
					options={THEME_OPTIONS}
					onChange={theme => onChange({ theme })}
				/>
			}
		/>

		<SettingsRow
			title="Акцентный цвет"
			description="Основной цвет интерфейса"
			icon={PaletteIcon}
			trailing={
				<SettingsSegmentedControl
					label="Акцентный цвет"
					value={settings.accent}
					options={ACCENT_OPTIONS}
					onChange={accent => onChange({ accent })}
				/>
			}
		/>

		<SettingsRow
			title="Плотность интерфейса"
			description="Компактный режим уменьшает расстояния между элементами."
			icon={MonitorIcon}
			trailing={
				<SettingsSegmentedControl
					label="Плотность интерфейса"
					value={settings.density}
					options={DENSITY_OPTIONS}
					onChange={density => onChange({ density })}
				/>
			}
		/>

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
	</Section>
)

export const SettingsAppearance = memo(SettingsAppearanceComponent)
SettingsAppearance.displayName = "SettingsAppearance"
