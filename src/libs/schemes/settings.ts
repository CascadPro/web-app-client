import { z } from "zod"

const themeEnum = ["system", "light", "dark"] as const
const accentEnum = ["orange", "blue", "mauve", "green", "teal", "rose"] as const
const animationsEnum = ["system", "enabled", "disabled"] as const
const densityEnum = ["comfortable", "compact"] as const
const textSizeEnum = ["small", "medium", "large"] as const
const sessionExpireEnum = ["7d", "30d", "90d"] as const

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
	textSize: z.enum(textSizeEnum).optional(),
	confirmImportantActions: z.boolean().optional(),
	sessionExpireTerm: z.enum(sessionExpireEnum).optional(),
	session2FAEnabled: z.boolean().optional(),
	notifications: notificationsSchema
})
