import { z } from "zod"

import type {
	AccentPreference,
	AnimationPreference,
	DensityPreference,
	ThemePreference
} from "@/types/screens/settings"

const themeEnum: ThemePreference[] = ["system", "light", "dark"]
const accentEnum: AccentPreference[] = [
	"orange",
	"blue",
	"mauve",
	"green",
	"teal",
	"rose"
]
const animationsEnum: AnimationPreference[] = ["system", "enabled", "disabled"]
const densityEnum: DensityPreference[] = ["comfortable", "compact"]

const notificationsSchema = z
	.object({
		requests: z.boolean().optional(),
		sessions: z.boolean().optional(),
		system: z.boolean().optional(),
		push: z.boolean().optional()
	})
	.optional()

export const storedSettingsScheme = z.object({
	theme: z.enum(themeEnum).optional(),
	accent: z.enum(accentEnum).optional(),
	animations: z.enum(animationsEnum).optional(),
	density: z.enum(densityEnum).optional(),
	notifications: notificationsSchema
})
