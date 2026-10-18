import type { SettingsState } from "@/types/screens/settings"

export const SETTINGS_STORAGE_KEY = "cascade:settings:v1"

export const DEFAULT_SETTINGS: SettingsState = {
	theme: "system",
	accent: "orange",
	animations: "system",
	density: "comfortable",
	notifications: {
		requests: true,
		sessions: true,
		system: true,
		push: false
	}
}


export const ACCENT_COLORS = {
	orange: {
		light: {
			primary: "#f08c00",
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

export const SETTINGS_CACHE_PREFIX = "cascade-pwa-"
