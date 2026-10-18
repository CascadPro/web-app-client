"use client"

import { BellRingIcon } from "lucide-react"
import { type FC, memo } from "react"

import { Switch } from "@/components/ui"
import { SETTINGS_NOTIFICATIONS_ROWS } from "@/libs/constants/screens/settings"
import type {
	NotificationKey,
	NotificationSettings
} from "@/types/screens/settings"

import { SettingsRow } from "../settings-row"
import { SettingsSection } from "../settings-section"

interface Props {
	settings: NotificationSettings
	onChange: (key: NotificationKey, value: boolean) => void
}

const SettingsNotificationsComponent: FC<Props> = ({ settings, onChange }) => {
	return (
		<SettingsSection
			id="notifications"
			title="Уведомления"
			description="Выберите, о каких событиях сообщать"
			icon={BellRingIcon}
		>
			{SETTINGS_NOTIFICATIONS_ROWS.map(row => (
				<SettingsRow
					key={row.key}
					title={row.title}
					description={row.description}
					icon={row.icon}
					className="flex items-center justify-between"
					trailing={
						<Switch
							label={row.title}
							checked={settings[row.key]}
							onCheckedChange={value => onChange(row.key, value)}
						/>
					}
				/>
			))}
		</SettingsSection>
	)
}

export const SettingsNotifications = memo(SettingsNotificationsComponent)
SettingsNotifications.displayName = "SettingsNotifications"
