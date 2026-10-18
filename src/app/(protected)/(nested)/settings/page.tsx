import type { Metadata } from "next"

import { SettingsScreen } from "@/components/screens/settings/settings"

export const metadata: Metadata = {
	title: "Настройки | Cascade Pro"
}

export default function SettingsPage() {
	return <SettingsScreen />
}
