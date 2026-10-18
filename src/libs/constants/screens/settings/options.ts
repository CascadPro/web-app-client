import type {
	AccentPreference,
	AnimationPreference,
	DensityPreference,
	SettingsOption,
	ThemePreference
} from "@/types/screens/settings"

export const THEME_OPTIONS: SettingsOption<ThemePreference>[] = [
	{ value: "system", label: "Системная" },
	{ value: "light", label: "Светлая" },
	{ value: "dark", label: "Тёмная" }
]

export const ACCENT_OPTIONS: SettingsOption<AccentPreference>[] = [
	{ value: "orange", label: "Оранжевый" },
	{ value: "blue", label: "Голубой" },
	{ value: "mauve", label: "Лиловый" },
	{ value: "green", label: "Зелёный" }
]

export const ANIMATION_OPTIONS: SettingsOption<AnimationPreference>[] = [
	{ value: "system", label: "Системные" },
	{ value: "enabled", label: "Включены" },
	{ value: "disabled", label: "Выключены" }
]

export const DENSITY_OPTIONS: SettingsOption<DensityPreference>[] = [
	{ value: "comfortable", label: "Обычная" },
	{ value: "compact", label: "Компактная" }
]
