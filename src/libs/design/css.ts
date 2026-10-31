import { DESIGN } from "./config"
import {
	ACCENT_COLORS,
	type AccentName,
	NEUTRAL_COLORS,
	STATUS_COLORS,
	type ThemeName
} from "./palette"

const kebab = (key: string) => key.replace(/[A-Z]/g, c => `-${c.toLowerCase()}`)

const toVars = (values: Record<string, string>, prefix = "") =>
	Object.entries(values)
		.map(([key, value]) => `--${prefix}${kebab(key)}:${value}`)
		.join(";")

const ms = (seconds: number) => `${Math.round(seconds * 1000)}`

const motionVars = () => {
	const { duration, ease } = DESIGN.motion

	const durations = Object.entries(duration)
		.map(([k, v]) => `--motion-${k}:calc(${ms(v)}ms * var(--motion-scale,1))`)
		.join(";")

	const eases = Object.entries(ease)
		.map(([k, v]) => `--ease-ui-${kebab(k)}:cubic-bezier(${v.join(",")})`)
		.join(";")

	return `${durations};${eases}`
}

const themeBlock = (theme: ThemeName) =>
	[
		`color-scheme:${theme}`,
		toVars(NEUTRAL_COLORS[theme]),
		toVars(STATUS_COLORS[theme]),
		toVars(ACCENT_COLORS.orange[theme]),
		toVars(DESIGN.glass[theme], "glass-")
	].join(";")

const accentNames = Object.keys(ACCENT_COLORS) as AccentName[]

/**
 * Весь дизайн-CSS одной строкой. Считается один раз при загрузке модуля
 * и отдаётся как статический <style> в <head> (кэшируется вместе с HTML).
 *
 * Специфичность: `.dark[data-accent]` > `:root[data-accent]` > `.dark` > `:root`,
 * поэтому тёмные блоки акцентов идут после светлых.
 */
export const DESIGN_CSS = [
	`:root{${themeBlock("light")};--motion-scale:1;${motionVars()}}`,
	`:root[data-perf="low"]{--motion-scale:${DESIGN.motion.liteScale}}`,
	`.dark{${themeBlock("dark")}}`,
	...accentNames.map(
		name => `:root[data-accent="${name}"]{${toVars(ACCENT_COLORS[name].light)}}`
	),
	...accentNames.map(
		name => `.dark[data-accent="${name}"]{${toVars(ACCENT_COLORS[name].dark)}}`
	)
].join("\n")
