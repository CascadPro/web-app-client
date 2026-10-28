import type {
	AccentPreference,
	AnimationPreference,
	DensityPreference,
	SessionExpireTerm,
	SettingsOption,
	TextSizePreference,
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
	{ value: "green", label: "Зелёный" },
	{ value: "teal", label: "Бирюзовый" },
	{ value: "rose", label: "Розовый" }
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

export const TEXT_SIZE_OPTIONS: SettingsOption<TextSizePreference>[] = [
	{ value: "small", label: "Маленький" },
	{ value: "medium", label: "Обычный" },
	{ value: "large", label: "Большой" }
]

export const SESSION_EXPIRE_OPTIONS: SettingsOption<SessionExpireTerm>[] = [
	{ value: "7d", label: "7 дней" },
	{ value: "30d", label: "30 дней" },
	{ value: "90d", label: "90 дней" }
]
