/**
 * Палитра приложения — единственное место, где задаются цвета.
 * CSS-переменные генерируются из неё в libs/design/css.ts.
 *
 * Контраст (WCAG) проверен для пар primary/on-primary, primary/background,
 * on-surface-variant/surface и статусных цветов (все >= 4.5:1).
 */

export const ACCENT_COLORS = {
	orange: {
		light: {
			primary: "#b05800",
			onPrimary: "#ffffff",
			primaryContainer: "#ffddb0",
			onPrimaryContainer: "#512900",
			secondary: "#c65d16",
			onSecondary: "#ffffff",
			secondaryContainer: "#ffdcc8",
			onSecondaryContainer: "#492000"
		},
		dark: {
			primary: "#ffb74d",
			onPrimary: "#422b00",
			primaryContainer: "#754000",
			onPrimaryContainer: "#ffddb0",
			secondary: "#ffb68c",
			onSecondary: "#512000",
			secondaryContainer: "#713716",
			onSecondaryContainer: "#ffdcc8"
		}
	},
	blue: {
		light: {
			primary: "#1976d2",
			onPrimary: "#ffffff",
			primaryContainer: "#d3e4ff",
			onPrimaryContainer: "#001c3a",
			secondary: "#42618c",
			onSecondary: "#ffffff",
			secondaryContainer: "#d6e3ff",
			onSecondaryContainer: "#001c3b"
		},
		dark: {
			primary: "#90caff",
			onPrimary: "#003258",
			primaryContainer: "#00497d",
			onPrimaryContainer: "#d3e4ff",
			secondary: "#afc8f5",
			onSecondary: "#193354",
			secondaryContainer: "#30496b",
			onSecondaryContainer: "#d6e3ff"
		}
	},
	mauve: {
		light: {
			primary: "#8839ef",
			onPrimary: "#ffffff",
			primaryContainer: "#efdbff",
			onPrimaryContainer: "#2d0056",
			secondary: "#6750a4",
			onSecondary: "#ffffff",
			secondaryContainer: "#e9ddff",
			onSecondaryContainer: "#220f5a"
		},
		dark: {
			primary: "#d0bcff",
			onPrimary: "#381e72",
			primaryContainer: "#523b91",
			onPrimaryContainer: "#efdbff",
			secondary: "#cbbdff",
			onSecondary: "#35275f",
			secondaryContainer: "#4c3e76",
			onSecondaryContainer: "#e9ddff"
		}
	},
	green: {
		light: {
			primary: "#347a35",
			onPrimary: "#ffffff",
			primaryContainer: "#b9f0b1",
			onPrimaryContainer: "#002204",
			secondary: "#386a43",
			onSecondary: "#ffffff",
			secondaryContainer: "#bdecc5",
			onSecondaryContainer: "#00210b"
		},
		dark: {
			primary: "#a0d99a",
			onPrimary: "#07390e",
			primaryContainer: "#1b5d24",
			onPrimaryContainer: "#b9f0b1",
			secondary: "#a2d4a7",
			onSecondary: "#0b3920",
			secondaryContainer: "#225132",
			onSecondaryContainer: "#bdecc5"
		}
	},
	teal: {
		light: {
			primary: "#007f78",
			onPrimary: "#ffffff",
			primaryContainer: "#9ff2e8",
			onPrimaryContainer: "#00201d",
			secondary: "#426863",
			onSecondary: "#ffffff",
			secondaryContainer: "#c5ece5",
			onSecondaryContainer: "#00201c"
		},
		dark: {
			primary: "#80d5cb",
			onPrimary: "#003733",
			primaryContainer: "#00504a",
			onPrimaryContainer: "#9ff2e8",
			secondary: "#a3d1ca",
			onSecondary: "#103833",
			secondaryContainer: "#294f4a",
			onSecondaryContainer: "#c5ece5"
		}
	},
	rose: {
		light: {
			primary: "#c2185b",
			onPrimary: "#ffffff",
			primaryContainer: "#ffd9e3",
			onPrimaryContainer: "#3e0019",
			secondary: "#8c4a60",
			onSecondary: "#ffffff",
			secondaryContainer: "#ffd9e3",
			onSecondaryContainer: "#3a071e"
		},
		dark: {
			primary: "#ffb1c8",
			onPrimary: "#65002d",
			primaryContainer: "#8e0043",
			onPrimaryContainer: "#ffd9e3",
			secondary: "#f0b2c7",
			onSecondary: "#49172d",
			secondaryContainer: "#633347",
			onSecondaryContainer: "#ffd9e3"
		}
	}
} as const

export type AccentName = keyof typeof ACCENT_COLORS
export type ThemeName = "light" | "dark"

/** Нейтральные цвета и «поверхности». Кроме outline используются с альфой (/20, /40 ...). */
export const NEUTRAL_COLORS = {
	light: {
		background: "#ffffff",
		onBackground: "#1c1c1e",
		surface: "#f5f5f7",
		onSurface: "#1c1c1e",
		surfaceVariant: "#ebebf0",
		onSurfaceVariant: "#6b6b73",
		outline: "#aeaeb2",
		error: "#d32f2f",
		onError: "#ffffff",
		errorContainer: "#ffdad6",
		onErrorContainer: "#8c0009",
		scrim: "rgb(0 0 0 / 32%)"
	},
	dark: {
		background: "#121212",
		onBackground: "#e5e5ea",
		surface: "#1c1c1e",
		onSurface: "#f2f2f7",
		surfaceVariant: "#2c2c2e",
		onSurfaceVariant: "#aeaeb8",
		outline: "#8e8e93",
		error: "#ff8a80",
		onError: "#4a0004",
		errorContainer: "#8c0009",
		onErrorContainer: "#ffdad6",
		scrim: "rgb(0 0 0 / 60%)"
	}
} as const

/**
 * Семантические статусные цвета (раньше были захардкожены как emerald-500/600/400,
 * amber-500/600, red-300/400/500 в 8+ местах и не адаптировались к тёмной теме).
 */
export const STATUS_COLORS = {
	light: {
		success: "#1b7f3b",
		onSuccess: "#ffffff",
		successContainer: "#d4f5dc",
		onSuccessContainer: "#00240c",
		warning: "#8a5a00",
		onWarning: "#ffffff",
		warningContainer: "#ffe8b8",
		onWarningContainer: "#2c1c00",
		info: "#0b6bcb",
		onInfo: "#ffffff",
		infoContainer: "#d6e8ff",
		onInfoContainer: "#001d3a"
	},
	dark: {
		success: "#5dd27c",
		onSuccess: "#003a14",
		successContainer: "#0d4a22",
		onSuccessContainer: "#bdf2c9",
		warning: "#ffc857",
		onWarning: "#3d2800",
		warningContainer: "#5a3c00",
		onWarningContainer: "#ffe3a8",
		info: "#7ab8ff",
		onInfo: "#002f5c",
		infoContainer: "#0b4a8a",
		onInfoContainer: "#d6e8ff"
	}
} as const
